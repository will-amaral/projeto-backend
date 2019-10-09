/**
 * Primeiramente importamos o roteador do express e o definimos em duas instâncias
 * separadas, para rotas públicas e privadas. Utilizamos também o pacote express-validator
 * para validar os dados antes de serem passados ao banco de dados.
 *  Duas funções auxiliares são importados do objeto helper.
 */
const router = require('express').Router();
const secureRouter = require('express').Router();
const { check } = require('express-validator');
const UserController = require('../../controllers/UserController');
const { validateErrors, cpfValidate } = require('../helper');
/**
 * A primeira rota a ser declara é a de cadastro. A requisição é do tipo POST, e recebe
 * como parâmetro um array com as validações, tratamento de erros, e o controlador.
 */
router.post(
  '/signup',
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
      .withMessage('Sua senha deve conter pelo menos uma letra'),
    check('name')
      .isLength({ min: 3 })
      .withMessage('Esse nome é muito curto!'),
    check('phone')
      .isMobilePhone()
      .withMessage('Número de telefone inválido'),
    check('cpf')
      .isNumeric()
      .custom(value => cpfValidate(value))
      .withMessage('CPF Inválido')
  ],
  validateErrors,
  UserController.create
);
/**
 * A segunda rota é do tipo get, portanto não necessita de validação de erros.
 * Um segundo router é definido para separar as rotas privadas.
 */
secureRouter.get('/profile', UserController.read);

module.exports = { router, secureRouter };
