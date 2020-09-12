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
            console.log(`${pokeList[i].name} and ${pokeList[i].id}`);
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