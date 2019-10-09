/**
 * Aqui importamos a classe Schema do mongoose
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

/**
 * A Schema financial Schema contém os dados financeiros de usuários
 * do nível Aluno. O valor definido em amount utiliza getters
 * e setters para formatar o número.
 */
const financialSchema = new Schema({
  dueDay: {
    type: Number,
    min: 1,
    max: 31
  },
  plan: {
    type: String,
    enum: ['Mensal', 'Semestral', 'Anual']
  },
  amount: {
    type: Number,
    set: function(num) {
      return num * 100;
    },
    get: function(num) {
      return (num / 100).toFixed(2);
    }
  }
});

/**
 * Usamos a função "discriminator" do model User,
 * para extender a Schema. Ela adiciona uma chave 'level'
 * do tipo 'Aluno'. Todos os documentos desse tipo devem
 * possuir a propriedade financial e podem opcionalmente
 * adicionar a propriedade social.
 */

module.exports = User.discriminator(
  'Aluno',
  new Schema({
    financial: {
      type: financialSchema,
      required: true
    },
    social: {
      facebook: 'String',
      instagram: 'String'
    }
  })
);
