// O caminho final na construção de uma requisição é a construção das rotas.
// Aqui separamos as rotas dos controladores para facilitar a leitura do código. 
// Primeiramente importamos o roteador do express e o definimos em duas instâncias separadas.
// O secureRouter será utilizado para as requsições que necesitam de validação antes de serem
// finalizadas, enquanto o outro será para requisições públicas. Utilizamos também o pacote
// express-validator para validar os dados antes de serem passados ao banco de dados. 
// Também importamos a função de validação de cpf, separada para clareza do código. 
const router = require('express').Router();
const secureRouter = require('express').Router();
const { check, validationResult } = require('express-validator');
const user = require('../controllers/user');
const cpfValidate = require('./cpfValidate');
// Essa é a função responsável pela validação dos dados e envio da resposta de erro.
// Os erros são enviados no formato de array
function validateErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
}
// A primeira rota a ser declara é a de cadastro. A requisição é do tipo POST, e recebe
// como parâmetro um array com as validações, a função de validação, e a função do controlador. 
router.post('/signup', [
    check('email').isEmail().withMessage('Entre um e-mail válido'),
    check('password')
      .isLength({ min: 8}).withMessage('Sua senha deve ter pelo menos 8 caracteres')
      .matches(/\d/).withMessage('Sua senha deve conter um número')
      .matches(/[a-zA-Z]/).withMessage('Sua senha deve conter pelo menos uma letra'),
    check('name').isLength({min: 3}).withMessage('Esse nome é muito curto!'),
    check('phone').isMobilePhone().withMessage('Número de telefone inválido'),
    check('cpf').isNumeric().custom(value => cpfValidate(value)).withMessage('CPF Inválido'),
], validateErrors, user.create);

// A segunda rota é a de login. Recebe os mesmos parâmetros que a rota de cadastro.
router.post('/login', [
    check('email').isEmail().withMessage('Entre um e-mail válido'),
    check('password')
      .isLength({ min: 8}).withMessage('Sua senha deve ter pelo menos 8 caracteres')
      .matches(/\d/).withMessage('Sua senha deve conter um número')
      .matches(/[a-zA-Z]/).withMessage('Sua senha deve conter pelo menos uma letra'),
], validateErrors, user.login);

// A rota de perfil é do tipo get. O único parâmetro recebido é a função definida nos
// controladores
secureRouter.get('/profile', user.profile);

module.exports = { router, secureRouter }