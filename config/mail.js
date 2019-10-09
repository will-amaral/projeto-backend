/**
 * Declaração de todas as variáveis de middleware principais,
 * aqui utilizamos os pacotes crypto (pacote nativo do Nodejs)
 * nodemailer e nodemailer-express-handlebars
 * Importamos também o model do Token e as variáveis de ambiente
 * que serão utilizadas na configuração para o envio de emails
 */
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const Token = require('../models/Token');
const host = process.env.NODE_HOST;
const user = process.env.NODE_USER;
const pass = process.env.NODE_PASS;

/**
 * Criamos a função mail, que será responsável pelo envio
 * de e-mails automatizados
 */

async function mail(email, token, recover) {
  // Aqui criamos o transporter, que é o objeto responsável pelo
  // envio dos e-mails, e passamos as configurações necessárias.
  const transporter = nodemailer.createTransport({
    host,
    port: 465,
    secure: true,
    auth: { user, pass }
  });
  // Para facilitar a formatação dos e-mails, utilizamos
  // o pacote handlebars, nossa engine de templates
  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        extname: '.hbs',
        layoutsDir: 'templates/',
        defaultLayout: 'mail',
        partialsDir: 'templates/partials/'
      },
      viewPath: 'templates/',
      extName: '.hbs'
    })
  );
  // Cria os detalhes do email (armazenamos os detalhes em variáveis específicas)
  let url;
  let message;
  let subject;
  let title;
  if (recover) {
    url = `http://localhost:3000/nova-senha/${token}`;
    subject = 'Altere a sua senha';
    title = 'Link para redefinição de senha';
    message =
      'Olá!, \n\n' +
      'Aqui está o seu link para redefinição de senha. \n' +
      'Clique no link abaixo para inserir uma nova senha. \n';
  } else {
    url = `http://localhost:3000/confirmar/${token}`;
    subject = 'Confirme o seu e-mail';
    title = 'Verifique a sua conta';
    message =
      'Olá!, \n\n' +
      'Por favor, verifique a sua conta. \n' +
      'Clique no link abaixo para realizar a verificação \n';
  }
  // Envia o email com as opções definidas
  const response = await transporter.sendMail({
    from: '"Teste Will" <donotreply@mercuriosys.com>',
    to: email,
    subject,
    text: message + url,
    template: 'mail',
    context: { url, message, title }
  });
  console.log(response);
}
/**
 * Exportamos a função principal,  que gera o token com o id do usuário
 * e envia para o email do mesmo, com a função mail.
 */
module.exports = async function(user, email, recover) {
  const randomToken = await crypto.randomBytes(16).toString('hex');
  await Token.create({
    _userId: user.id,
    token: randomToken
  });
  await mail(email, randomToken, recover);
};
