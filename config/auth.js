// Declaração de todas as variáveis de middleware principais, 
// incluindo o pacote passport, que é responsável pela autenticação
// e os pacotes passport-local e passport-jwt, que são as estratégias
// definidas para este projeto
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;
// Também importamos o User model e a função para o envio de emails
const User = require('../models/user');
const sendMail = require('./mail');
// Primeiramente, criamos uma middleware de cadastro de usuários
// utilizando a estratégia Local. A função passport.use recebe como parâmetro
// o nome da nossa middleware e uma instância de classe de estratégia.
// No nosso caso, utilizamos a estratégia local, que por sua vez é configurada
// com uma função executada durante a requisição. Essa função pega os dados
// que são passados via HTTP POST e cria um novo usuário no banco de dados
// com esses dados. Em seguida, enviamos os dados de criação do usuário para o e-mail
// do usuário utilizando a função sendMail. Em seguida, chamamos a função done, que
// passa as informações (normais ou de erro) para a próxima middleware. 
passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: 'true'
}, async function (req, email, password, done) {
    const { name, cpf, address, phone, birthDate, level, gender } = req.body;
    try {
        const user = await User.create({
            email, password, name, cpf, address,
            birthDate, phone, level, gender
        });
        await sendMail(user, email, false);
        return done(null, user);
    } catch(error) {
        done(error);
    }
}));
// A segunda middleware definida na aplicação é a de login. A estrturua é a mesma de
// cadastro, com a diferença na função que é passada para a estratégia. Aqui fazemos
// uma requisição ao banco de dados para encontrar o usuário a partir do e-mail, que
// deve ser único. Em seguida, validamos a senha com a função criada no User Model. 
// Por fim, é verificado o status da conta. Para cada verificação, finalizamos a função,
// enviando a mensagem e o tipo de erro para a próxima middleware. 
passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async function (email, password, done) {
    try {
        const user = await User.findOne({ email }, '+password');
        if (!user) {
            return done(null, false, { error: 401, message: 'Usuário não encontrado' });
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
            return done(null, false, { error: 401, message: 'Senha incorreta'});
        }
        if (!user.isActive) {
            return done(null, false, { error: 401, message: 'Conta inativa. Verifique seu e-mail'})
        }
        return done(null, user, { message: 'Login realizado com sucesso' });
    } catch(error) {
        return done(error);
    }
}));
// Por fim, a última middleware do passport é a de validação de tokens
// Aqui definimos com a estratégia de JWT (Json Web Token). Esse token será utilizado
// para todas as requisições seguras. Utilizamos o Header Auth do tipo Bearer
// para receber os tokens. A validação do token recupera o usuário responsável
// e passa para a próxima middleware
passport.use(new jwtStrategy({
    secretOrKey: 'secret',
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken()
}, async function (token, done) {
    try {
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));