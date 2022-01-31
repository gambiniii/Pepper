const mongoose = require('mongoose')

const HomeSchema = new mongoose.Schema({
    titulo: {type: String, required: true}, //required --> SE NÃO FOR ENVIADO, IMPLICARÁ EM UM ERRO
    descricao: String
})

const HomeModel = mongoose.model('Home', HomeSchema);

module.exports = HomeModel