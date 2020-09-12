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

async function getAllPokemonFr(P, pokeNbr, pokeList)
{
    for (var i = 0; i <= pokeNbr + 1; i++) {
        await P.getPokemonSpeciesByName(i + 1)
        .then( async function(response) {
            var lang = await getLanguageName(response.names, 'fr');
            if (lang == -1) {
                pokeList[i] = {name: response.name, id: response.id};
            } else {
                pokeList[i] = {name: response.names[lang].name, id: response.id};
            }
        })
        .catch(function(error) {
            // console.log('There was an ERROR: ', error);
        });
    }
}

exports.getNameIdList = async function (P)
{
    var pokeList = [];
    var pokeNbr;
    await P.getPokemonSpeciesList().then(function(response) {
        pokeNbr = response.count;
    });
    await getAllPokemonFr(P, pokeNbr, pokeList);
    return {pokeList: pokeList, pokeNbr: pokeNbr};
};

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
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/');
            } else {
                res.send('Incorrect username or password.');
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
                res.send('Username already exists.')
            } else {
                connection.query('INSERT INTO `accounts` (`username`, `password`) VALUES (?, ?)', [username, password], function(error, results, fields) {
                    if (error) throw error;
                    res.send('User registered.')
                });
            }
        })
    } else {
        res.send('Enter username and password.');
        res.end();
    }
}