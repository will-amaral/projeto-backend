/**
 * Aqui importamos a classe Schema do mongoose, para criação
 * da nossas Schema. Importamos também o pacote bcrypt que
 * será responsável pelo hash das senhas armazenadas no banco de dados
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const options = { discriminatorKey: 'level' };

/**
 * Aqui realizamos a configuração da Schema principal, definindo os
 * campos necessários para o documento User e armazenamos a nova
 * Schema na variável userSchema. Essa Schema servirá de base
 * para criação dos três tipos de usuário.
 */
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    cpf: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    birthDate: {
      type: Date,
      required: true
    },
    status: {
      type: Boolean,
      default: false,
      required: true
    },
    gender: {
      type: String,
      enum: ['M', 'F', 'NB', 'Outro']
    },
    thumbnail: String
  },
  options
);

/**
 * Uma vez criado a Schema, podemos definir "hooks", funções que são
 * chamadas em determinado momento do ciclo de vida do Model, como o Update de
 * algum campo. O hook que estamos criando é um hook "pre" com parâmetro save,
 * que é executado toda vez que o usuário utilizar a função "save()"
 * para atualizar ou criar campos no model de um documento.
 * Como é um hook pre, ele é executado antes do documento ser salvo.
 * O segundo parâmetro é a função que queremos que seja executada.
 */
userSchema.pre('save', async function(next) {
  const user = this;
  // Aqui criamos o hash em 10 rounds de segurança.
  // Números maiores aumentam a segurança mas diminuem a performance.
  if (user.password) {
    const hash = await bcrypt.hash(user.password, 10);
    // Substituimos a senha pela versão criptografada a ser salva no banco de dados
    user.password = hash;
    // A função hash encerra o hook e e chama a próxima middleware.
    next();
  } else {
    next();
  }
});
/**
 * Além de hooks, podemos definir métodos especiais do model.
 * O método isValidPassword retorna um booleano que define se a
 * senha entrada é válida ou não
 */

//
userSchema.methods.isValidPassword = async function(password) {
  const user = this;
  // Compara a senha passada como parâmetro com a senha armazenada no banco de dados
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};
/**
 * Uma vez definida a Schema exportamos o módulo para ser utilizada em
 * outros pontos da aplicação como um Model do mongoose
 */
module.exports = mongoose.model('User', userSchema);
