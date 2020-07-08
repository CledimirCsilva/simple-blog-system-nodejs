const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Postagem');
require('../models/Categoria');
const Postagem = mongoose.model('meusposts');
const Categoria = mongoose.model('categoria');

//Rotas
router.get('/', (req, res) => {

    Postagem.find().populate('categorias').sort({data: 'desc'}).lean().then((postagens) => {
        res.render('index', {postagens: postagens})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno.'+err);
        res.redirect('/404');
    });
});

router.get('/404', (req, res) => {
    res.send('Erro 404!')
})

module.exports = router;