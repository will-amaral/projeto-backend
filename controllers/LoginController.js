/**
 * Aqui definimos as funções controladores que serão responsáveis
 * pelo tratamento de usuários. Inicialmente importamos todos os módulos
 * nativos e definidos pelo usuário.
 */

const passport = require('passport');
const jwt = require('jsonwebtoken');

/**
 * A função principal deste controlador utiliza a estratégia de login que
 * definimos nas configurações, com o adicional de criar um web token referente
 * ao usuário do login. Esse token ficará responsável pelas próximas
 * requisições seguras e deve ser armazenado pelo cliente.
 */

exports.index = async function(req, res, next) {
  passport.authenticate('login', async function(error, user, info) {
    try {
      if (info.error) {
        return res.status(401).send(info);
      }
      if (error || !user) {
        const err = new Error('Erro');
        return next(err);
      }
      req.login(user, { session: false }, async function(error) {
        if (error) return next(error);
        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, 'secret');
        const message = info.message;
        console.log({ message, token });
        return res.json({ message, token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};
