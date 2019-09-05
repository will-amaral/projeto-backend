// Aqui importamos a classe Schema do mongoose, para criação
// da nossas Schema. 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Aqui definimos diretamente o modelo, passando o segundo parâmetro
// de criação de modelo diretamente para a função mongoose.model, uma vez
// que não precisamos criar hooks ou métodos customizados. 
module.exports = mongoose.model('Token', new Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
}));