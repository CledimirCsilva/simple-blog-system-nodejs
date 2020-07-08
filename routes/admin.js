const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
require('../models/Postagem');
const Categoria = mongoose.model('categoria');
const Postagem = mongoose.model('meusposts');

//Rotas
router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/categorias', (req, res) => {
    Categoria.find().sort({date: 'desc'}).lean().then((categorias) => {
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao listar as Categorias")
        res.redirect('/admin')
    })
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategoria')
})

router.post('/categorias/nova', (req, res) => {
    
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }
    
    if(req.body.nome.length < 3){
        erros.push({texto: "Nome da Categoria muito pequeno"})
    }

    if(erros.length > 0){
        res.render('/admin/addcategoria', {erros: erros})
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save()
        .then(() => {
            req.flash("success_msg", "Categoria criada com sucesso")
            res.redirect('/admin/categorias')
        } )
        .catch((err) => {
            req.flash("error_msg", "Houve um erro ao criar a Categoria")
            res.redirect('/admin/addcategoria')
        })
    }
})

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render('admin/editcategoria', {categoria: categoria})
    }).catch((err) => {
        req.flash('error_msg', 'Esta categoria não existe')
        res.redirect('/admin/categorias')
    })
    
})

router.post('/categorias/update/:id', (req, res) =>{

    const id = req.params.id;
    const { nome, slug } = req.body;

    Categoria.findOne({_id: id}).then((result) => {

        const categoriaEdited = {$set: { nome, slug }};

        Categoria.updateOne({_id: result.id}, categoriaEdited).then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err)=> {
            req.flash('error_msg', 'Houve um erro interno ao salvar a categoria')
            res.redirect('admin/categorias')
        })
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao editar a categoria")
        res.redirect('/admin/categorias')
    });
})

router.post('/categoria/deletar', (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a Categoria')
        res.redirect('/adimin/categorias')
    })
})

router.get('/postagens', (req, res) => {

    Postagem.find().populate('categorias').sort({data: 'desc'}).lean().then((postagens) => {
        res.render('admin/postagens', {postagens: postagens})
    }).catch((err) => {
        req.flash('error_msg', 'Nenhuma postagem regitrada.'+err)
    })
})

router.get('/postagem/add', (req, res) => {

    Categoria.find().lean().then((categorias) => {
        res.render('admin/addpostagem', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulário')
    })
    
})

router.post('/postagem/nova', (req, res) => {

    erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida"})
    }
    if(erros.lenght > 0){
        res.render('admin/postagens', {erros: erros})
    }else {

        const novoPost = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
        new Postagem(novoPost).save().then(() => {
            req.flash('success_msg', 'Post cadastrado com sucesso')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao cadastrar o Post'+err)
            res.redirect('/admin/postagens')
        })
    }
})

router.get('/postagem/edit/:id', (req, res) => {
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render('admin/editpostagem', {postagem: postagem, categorias: categorias})
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao listar as categorias')
            res.redirect('admin/postagens')
        })
        
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulário')
        res.redirect('/admin/postagens')
    })
})

router.post('/postagem/edit', (req, res) => {
    Postagem.findOne({_id: req.body.id}).then((postagem) => {
        
        postagem.titulo    = req.body.titulo,
        postagem.slug      = req.body.slug,
        postagem.descricao = req.body.descricao,
        postagem.conteudo  = req.body.conteudo,
        postagem.categoria = req.body.categoria
        
        postagem.save().then(() => {
            req.flash('success_msg', 'Post atualizado com sucesso')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao editar a Postagem')
            res.redirect('/admin/postagens')
        })
       
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar o Post' + err)
        res.redirect('/admin/postagens')
    })
})

router.get('/postagem/del/:id', (req, res) => {
    Postagem.findOne({_id: req.params.id}).then((postagem) => {
        postagem.deleteOne().then(() => {
            req.flash('success_msg', 'Post excluído com sucesso')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('erro_msg', 'Não foi possível excluir este Post')
            res.redirect('/admin/postagens')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Post não encontrado')
        res.redirect('/admin/postagens')
    })
})

module.exports = router