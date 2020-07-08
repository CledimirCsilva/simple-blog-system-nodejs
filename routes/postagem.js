const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { json } = require('body-parser');
require('../models/Postagem');
const Postagem = mongoose.model('meusposts');

router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    try {
        const postagem = await (await Postagem.findOne({ slug }));
        if(postagem) {
            return res.render('posts/index', {
                titulo: postagem.titulo,
                descricao: postagem.descricao,
                conteudo: postagem.conteudo,
                data: postagem.data
            });
        } else {
            req.flash('error_msg', 'Esta postagem não existe');
            res.redirect('/');
        }
    } catch(err) {
        res.json(err);
    }
    
});

module.exports = router;