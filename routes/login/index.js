/**
 * A rota de login recebe os mesmos parâmetros padrão na definição de rotas,
 * com a validação de erros verificando o e-mail e a senha do usuário.
 */
const router = require('express').Router();
const { check } = require('express-validator');
const { validateErrors } = require('../helper');
const LoginController = require('../../controllers/LoginController');

router.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('Entre um e-mail válido'),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Sua senha deve ter pelo menos 8 caracteres')
      .matches(/\d/)
      .withMessage('Sua senha deve conter um número')
      .matches(/[a-zA-Z]/)
      .withMessage('Sua senha deve conter pelo menos uma letra')
  ],
  validateErrors,
  LoginController.index
);

module.exports = router;
