var express = require('express');
var session = require('express-session');
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

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use( express.static( "public" ) )
.use(favicon(__dirname + '/public/favicon.ico'))
.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));

app.get('/', async function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    var params = new Object;
    params = await control.getNameIdList(P);
    res.render('list.ejs', await control.getNameIdList(P));
});

app.get('/pokemon/:idPokemon', async function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('pokemonView.ejs', await control.getPokemonSpec(P, req.params.idPokemon) + {res: res, req: req});
});

app.get('/login', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('login.ejs');
});

app.post('/auth', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    control.logInRequest(username, password, connection, res, req);
});

app.get('/register', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('register.ejs');
});

app.post('/register', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    control.registerRequest(username, password, connection, res, req);
});

app.use(function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Erreur 404, page introuvable');
});

app.listen(8080, () => console.log('Server started'));