const apiRoot = 'https://pokeapi.co/api/v2/pokemon/';
const idpokedex = document.querySelector('.pokedex');
const idPokeLista = document.querySelector('.pokelista');
const pokeimg = document.querySelector(".pokemon-img");
const pokename = document.querySelector(".pokemon-name");
const poketype = document.querySelector(".pokemon-type");
const pokestats = document.querySelector(".pokemon-stats");
const nodos = document.getElementsByClassName('nodoPokeLista');
const nodosStats = document.getElementsByClassName('stats');

var prevPage = null;
var nextPage = null; 
var actual = 1;
const limit = 18;

guessField.addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById("guessSubmit").click();
    }
})

guessField.addEventListener("click", function (event) {
    guessField.placeholder = 'Ingrese Id o Nombre';
})

guessSubmit.addEventListener("click", function (event) {
    guessField.value = '';
    guessField.placeholder = 'Busqueda';
    guessField.blur();
})

const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

function agregarPokemon(pokemon){
    pokeimg.src = pokemon.image;
    let pokeid = pokemon.id;
    pokename.textContent = pokeid.toString().padStart(3, '0')+". "+pokemon.name;
    poketype.textContent = "type: "+pokemon.type;
    if (pokestats.hasChildNodes()) {
        for (var i=0; i<pokemon.stats.length;i++){
            nodosStats[i].textContent=(pokemon.stats[i]+": "+pokemon.statsValue[i]);
        };
    } else {
        for (var i=0; i<pokemon.stats.length;i++){
            var node = document.createElement("li");
            node.classList.add("stats");
            node.textContent=(pokemon.stats[i]+": "+pokemon.statsValue[i]);
            pokestats.appendChild(node);
        };
    }      
}

const fetchPokemonList = url => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const { results, previous, next } = data;
            prevPage = previous,
            nextPage = next;
            for (let i=0; i < data.results.length; i++){
                let miPokemon = data.results[i];
                if (miPokemon) {
                    const {name, url} = miPokemon;
                    const urlArray = url.split('/');
                    const id = urlArray[urlArray.length -2];
                    nodos[i].textContent= id + '. ' + capitalize(name);
                    nodos[i].addEventListener("click", function () {
                         elegirPoke(this.textContent);
                    })
                } else {
                    node.textContent='';
                }
            }
        })
}

const fetchPokeData = url => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const pokemon = {
            name: data.name,
            id: data.id,
            image: data.sprites['front_default'],
            type: data.types.map((type) => type.type.name),
            stats: data.stats.map((stats) => stats.stat.name),
            statsValue: data.stats.map((stats) => stats.base_stat)
        };
        actual = pokemon.id;
        console.log(pokemon);
        agregarPokemon(pokemon);

      });

};

function crearNodosLista(value){
    for(let i = 0; i < value; i++){
        var node = document.createElement("li");
        node.classList.add("nodoPokeLista");
        idPokeLista.appendChild(node);
    }
}

function elegirPoke (value){
    var dato = capitalize(value);
    fetchPokeData (apiRoot+dato);
}

function siguientePag (){
    if (nextPage) {
        fetchPokemonList(nextPage);
    }
}

function anteriorPag (){
    if (prevPage) {
        fetchPokemonList(prevPage);
    }
}

function anteriorPoke(){
    if (actual > 1) {
        actual--;
        fetchPokeData(apiRoot+actual);
    }
}

function siguientePoke(){
    if (actual < 1118) {
        actual++;
        fetchPokeData(apiRoot+actual);
    }
}

function buscarPoke(){
    let dato = String(guessField.value);
    fetchPokeData(apiRoot+dato);
}

crearNodosLista(limit);
fetchPokeData(apiRoot+actual);
fetchPokemonList(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`);