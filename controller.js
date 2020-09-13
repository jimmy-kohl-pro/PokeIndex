 async function getUsernameWithId (connection, id, callback)
{
    connection.query('SELECT * FROM accounts WHERE user_id = ?', [id], function(error, results, fields) {
        if (err){ 
            throw err;
        }
        return callback(results[0].username);
    });
}

function getIdWithUsername(connection, username, callback)
{
    connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(err, results){
        if (err){ 
            throw err;
        }
        return callback(results[0].user_id);
  });
}

async function getLanguageName(namesList, lang)
{
    var res = -1;
    var find = 0;
    for (names of namesList) {
        res++;
        if (names.language.name == lang) {
            find = 1;
            break;
        }
    }
    if (find == 0)
        return -1;
    return res;
}

exports.getPokemonSpec = async function (P, id)
{
    var pokeName = null;
    await P.getPokemonSpeciesByName(id)
    .then( async function(response) {
        var lang = await getLanguageName(response.names, 'fr');
        if (lang == -1) {
            pokeSpec = {name: response.name, id: response.id};
        } else {
            pokeSpec = {name: response.names[lang].name, id: response.id};
        }
    })
    .catch(function(error) {
        // console.log('There was an ERROR: ', error);
    });
    return {pokeSpec: pokeSpec};
}

exports.logInRequest = function (username, password, connection, res, req)
{
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) throw error;
            console.log(results[0]);
            if (results) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/');
            } else {
                res.send("Mauvais nom d'utilisateur ou mot de passe.");
            }
            res.end();
        });
    } else {
        res.send('Enter username and password.')
        res.end();
    }
}

exports.registerRequest = function (username, password, connection, res, req)
{
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                res.send("Ce nom d'utilisateur existe déjà.");
            } else {
                connection.query('INSERT INTO `accounts` (`username`, `password`) VALUES (?, ?)', [username, password], function(error, results, fields) {
                    if (error) throw error;
                    res.send('Utilisateur enregistré.')
                });
            }
        })
    } else {
        res.send('Enter username and password.');
        res.end();
    }
}

exports.getComment = function (connection)
{
    var commentList = []
    return ({commentList : commentList})
}

  function getIdWithUsername(connection, username, callback)
{
    connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(err, results){
          if (err){ 
            throw err;
          }
          console.log(results[0].user_id);
          id_result = results[0].user_id;

          return callback(results[0].user_id);
  });
}

exports.addComment = function (connection, username, commentContent, pokemonId)
{
    try {
        var userId;
        getIdWithUsername(connection, username, function(result) {
            if (commentContent) {
                userId = result;
                connection.query('INSERT INTO `comments` (`content`, `pokemon_id_attach`, `user_id`) VALUES (?, ?, ?)', [commentContent,  pokemonId, userId]);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

function getPokemonMainInfo(P, i) {
    return new Promise((resolve) => {
      setTimeout(() => {
        P.getPokemonSpeciesByName(i + 1).then(async function(response) {
            var lang = 4;
            var lang = await getLanguageName(response.names, 'fr');
            if (lang == -1) {
                result = {name: response.name, id: response.id};
            } else {
                result = {name: response.names[lang].name, id: response.id};
            }
            console.log(result);
            resolve(result);
        }).catch(function(error) {
            result = {name: error, id: i + 1};
        });
      });
    });
}
  
exports.getPokeList = async function (P, req, res) {
    let i;
    let pokeList = [];
    var pokeNbr = null;
    await P.getPokemonSpeciesList().then(function(response) {
        pokeNbr = response.count;
    });
    for (i = 0; i < pokeNbr; ++i) {
        pokeList.push(getPokemonMainInfo(P, i).catch(function(error) {}));
    }
    
    Promise.all(pokeList).then((pokeListResult) => {
        res.render('list.ejs', { ...{pokeList: pokeListResult}, ...{req, res}, ...{pokeNbr: pokeNbr}});
    }).catch((e) => {
        res.send('Erreur interne.');
        res.end();
    });
}