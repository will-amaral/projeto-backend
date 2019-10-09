/**
 * O caminho final na construção de uma requisição é a construção das rotas.
 * A fim de organizar as importações e exportações de rotas,
 * definimos um ponto de concentração.
 */
const user = require('./user');
const login = require('./login');

module.exports = { user, login };
