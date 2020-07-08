const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
require('../models/Postagem');
const Categoria = mongoose.model('categoria');
const Postagem = mongoose.model('meusposts');

router.get('/', async (req, res) => {

    try{
        const categorias = await Categoria.find().lean();
        
        if(categorias) {
            return res.render('categorias/index', { categorias: categorias });
        }else {
            req.flash('error_msg', 'Nenhuma categoria encontrada.');
            res.redirect('/');
        }
    }catch(err){
        res.status(501);
        console.log('Houve um erro', err);
    }
});

router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    
    try {
        const categoria = await Categoria.findOne({ slug: slug });
        
        if(categoria){
            
            const posts = await Postagem.find({categoria: categoria._id}).lean();
            if(posts){
                res.render('posts/posts-por-categoria', {posts: posts})
            } else {
                return res.send('Nada');
            }
        }
    } catch(err){
        return console.log(err);
    }
    

});

module.exports = router;
