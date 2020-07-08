const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Categoria = new Schema({
    
    nome: {
        type: String,
        uppercase: true,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('categoria', Categoria)