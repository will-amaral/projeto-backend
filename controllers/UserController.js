/**
 * Aqui definimos as funções controladores que serão responsáveis
 * pelo tratamento de usuários. Inicialmente importamos todos os módulos
 * nativos e definidos pelo usuário.
 */
const passport = require('passport');
const User = require('../models/User');
/**
 * A função create faz parte dos métodos definidos como convenção do padrão mvc.
 * Ela é responsável pela criação de novos usuários, utilizando a estratégia
 * de cadastro que foi definida pelo passport nas configurações.
 */
exports.create = function(req, res, next) {
  passport.authenticate('signup', { session: false }, async function(error, user) {
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
        message:
          'Cadastro feito com sucesso! ' +
          'Ative a sua conta: ' +
          'um e-mail foi enviado para ' +
          user.email +
          '.',
        user: user.id
      });
    }
  })(req, res, next);
};
/**
 * A função read retorna os dados do perfil de um usuário específico.
 */
exports.read = async (req, res, next) => {
  const {
    user: { _id }
  } = req;
  console.log(_id);
  let profile = await User.findOne({ _id }).lean();
  if (!profile) {
    return res.status(400).json({
      message: 'Usuário não encontrado. Tente fazer login novamente'
    });
  }
  res.json({ profile });
  next();
};

exports.update = async (req, res, next) => {
  const {
    user: { _id }
  } = req;
  console.log(_id);
  let profile = await User.findOne({ _id });
  if (!profile) {
    return res.status(400).json({
      message: 'Usuário não encontrado'
    });
  }
};

exports.delete = async (req, res, next) => {
  const { _id } = req.body;
  console.log(_id);
  let profile = await User.findOne({ _id });
  if (!profile) {
    return res.status(400).json({
      message: 'Usuário não encontrado'
    });
  }
  await User.deleteOne({ _id });
  res.json({ message: 'O usuário foi deletado', _id });
  next();
};
