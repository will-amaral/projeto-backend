/**
 * O arquivo app.js é o ponto de partida da aplicação.
 * Aqui definimos os módulos principais, e os módulos
 * definidos pelo usuário. É aqui também que definimos
 * todas as middlewares criadas, incluindo as rotas.
 */

const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const app = express();
const { user, login } = require('./routes');
require('./config/auth');
/** Configuração do banco de dados utilizando o ORM mongoose */
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão mongodb: '));
db.once('open', () => console.log('📂 Conectado ao banco!'));
/** Utilização de todas as middlewares necessárias para a aplicação. */

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
/** Definição de rotas. As rotas seguras devem ser definidas com parâmetro adicional
 * de autenticação
 */
app.use('/', login.router);
app.use('/', user.router);
app.use(
  '/user',
  passport.authenticate('jwt', { session: false }),
  user.secureRouter
);
/** Inicializar o servidor. */

app.listen(4000, () => {
  console.log('🚀 Servidor online em http://localhost:4000');
});
