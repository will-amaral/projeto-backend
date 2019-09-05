// Aqui definimos as funções controladores que serão responsáveis
// pelo tratamento de usuários. Inicialmente importamos todos os módulos
// nativos e definidos pelo usuário. 
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');
const sendMail = require('../config/mail');
// Exportamos as funções diretamente, nomeadas de acordo com a sua funcionalidade. 
// A primeira é responsável pela criação de novos usuários, que utiliza a estratégia
// de cadastro definida pelo passport nas configurações. Como grande parte da funcionalidade
// já foi definida, apenas realizamos o tratamento de erros, e envio de respostas
// para as requisições
exports.create = function (req, res, next) {
    passport.authenticate('signup', { session: false }, async function (error, user) {
        if (error) {
            if (error.code == 11000) {
                res.status(400).json({
                    message: 'Já existe um usuário cadastrado com esse e-mail',
                    error: error.errmsg
                });
            } else {
                res.status(400).json({ message: 'Erro de cadastro', error });
            }
        } else {
            res.json({
                message: 'Cadastro feito com sucesso! ' + 
                        'Ative a sua conta: ' +
                        'um e-mail foi enviado para ' + 
                        user.email + '.',
                user: user.id
            });
        }
    })(req, res, next);
}
// A função de login utiliza a estratégia de login que definimos nas configurações,
// com o adicional de criar um web token referente ao usuário do login. Esse token
// ficará responsável pelas próximas requisições seguras e deve ser armazenado
// pelo cliente. 
exports.login = async function (req, res, next) {
    passport.authenticate('login', async function (error, user, info) {
        console.log(user, info, error);
        try {
            if (info.error) {
                return res.status(401).send(info);
            }
            if (error || !user) {
                const err = new Error('Erro');
                return next(err)
            }
            req.login(user, { session: false }, async function (error) {
                if (error) return next(error)
                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, 'secret');
                const message = info.message;
                return res.json({ message, token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
}
// A função profile retorna os dados do perfil de um usuário específico. 
// A rota deve ser coberta de forma segura no gerenciamento de rotas. 
exports.profile = async (req, res, next) => {
    const { user: { _id }} = req;
    console.log(_id);
    let profile = await User.findOne({ _id }).lean();
    if (!profile) {
      return res.status(400).json({
        message: 'Usuário não encontrado. Tente fazer login novamente'
      });
    }
    res.json({ profile });
    next();
  }