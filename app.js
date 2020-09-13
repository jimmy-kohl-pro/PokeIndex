var express = require('express');
var engine = require('ejs-mate');
var session = require('express-session');
var compression = require('compression');
var Pokedex = require('pokedex-promise-v2');
var favicon = require('serve-favicon'); 
const control = require('./controller.js');
var bodyParser = require('body-parser');
const config = require("./config.json");
var mysql = require("mysql");

var P = new Pokedex();
var app = express();

var connection = mysql.createConnection({
	host     : config.mysql.host,
	user     : config.mysql.user,
	password : config.mysql.password,
	database : config.mysql.database
});

app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Sert à récupérer les inputs des formulaires
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use( express.static( "public" ) )
.use(favicon(__dirname + '/public/favicon.ico'))
.use(compression())
.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));

app.get('/', async function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    control.getPokeList(P, req, res);
});

app.get('/pokemon/:idPokemon', async function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    params = { ...await control.getPokemonSpec(P, req.params.idPokemon), ...{req, res}, ...control.getComment(connection)}
    res.render('pokemonView.ejs', params);
});

app.get('/login', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('login.ejs', {req, res});
});

app.post('/auth', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    control.logInRequest(username, password, connection, res, req);
});

app.get('/register', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('register.ejs', {req, res});
});

app.post('/register', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    control.registerRequest(username, password, connection, res, req);
});

app.post('/logout', function(req, res) {
    if (req.session.loggedin) {
        req.session.loggedin = false;
        req.session.username = null;
        res.redirect('/')
    } else {
        res.send('Il faut être connecté pour faire ça.');
    }
    res.end();
});

app.post('/addcomment', function(req, res) {
    var backURL = req.header('Referer') || '/';
    pokemonId = backURL.split('/').slice(-1)[0];
    if (req.session.loggedin) {
        control.addComment(connection, req.session.username, req.body.comment, pokemonId);
    }
    res.redirect(backURL);
});

app.use(function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Erreur 404, page introuvable');
});

app.listen(8080, () => console.log('Serveur allumé'));