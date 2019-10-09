/**
 * Aqui importamos a classe Schema do mongoose
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
/**
 * Usamos a função "discriminator" do model User,
 * para extender a Schema. Neste caso, não adicionamos propriedades
 */

module.exports = User.discriminator('Admin', new Schema());
