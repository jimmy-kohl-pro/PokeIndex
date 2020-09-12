var express = require('express');
const { waitForDebugger } = require('inspector');
var Pokedex = require('pokedex-promise-v2');

var P = new Pokedex();
var app = express();

const control = require('./controller.js');


app.get('/', async function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    var params = new Object;
    params = await control.getNameIdList(P);
    res.render('list.ejs', {pokeList: params.pokeList, pokeNbr: params.pokeNbr});
});

app.get('/pokemon/:idPokemon', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    P.getPokemonSpeciesByName(req.params.idPokemon)
    .then(function(response) {
        res.render('pokemonView.ejs', {pokeName: response.names[4].name});
    })
    .catch(function(error) {
        console.log('There was an ERROR: ', error);
    });
});

app.use( express.static( "public" ) );

app.use(function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Erreur 404, page introuvable');
})

app.listen(8080);