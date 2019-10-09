/**
 * Aqui importamos a classe Schema do mongoose
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

/**
 * A Schma student busca apenas uma referência à outros documentos
 * do tipo usuário para os instrutores.
 */
const studentSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

/**
 * Usamos a função "discriminator" do model User,
 * para extender a Schema. Ela adiciona uma chave 'level'
 * do tipo 'Instrutor'. Adicionamos as propriedades específicas
 * desses documentos.
 */

module.exports = User.discriminator(
  'Instrutor',
  new Schema({
    role: {
      type: String,
      required: true
    },
    specialty: {
      type: String,
      required: true
    },
    students: [studentSchema]
  })
);
