// Carregando Módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const path = require('path');

    const adminRoute = require('./routes/admin');
    const indexRoute = require('./routes/index');
    const postagemRoute = require('./routes/postagem');
    const categoriaRoute = require('./routes/categoria');

    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash');

    require('dotenv-safe').config();

// Configurações

    // Sessão
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())

    //Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next()
    })

    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // Public
    app.use(express.static(path.join(__dirname,"public")))

    // Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    .then(() => console.log('Conectado ao Mongo'))
    .catch((err) => console.log("Erro ao conectar com o Mongo: " +err))

// Rotas
    app.use('/', indexRoute);
    app.use('/admin', adminRoute);
    app.use('/postagem', postagemRoute);
    app.use('/categorias', categoriaRoute);

// Outros

app.listen(process.env.PORT, () => { console.log('Servidor rodando...')} )

