const apiRoot = "https://pokeapi.co/api/v2/pokemon/";
const imageRoot = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/';
const imageRoot2 = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const idPokeLista = document.getElementById("pokelista"); // id => pokelista
const idShowPokemon = document.getElementById("showPokemon"); // id => showPokemon
const nodos = document.getElementsByClassName('nodoPokeLista');

const pokeimg = document.querySelector(".card-image");
const pokeName = document.querySelector(".card-title");
const pokeType = document.querySelector(".card-type");
const pokeExp = document.querySelector(".card-exp");
const pokeHeight = document.querySelector(".card-height");
const pokeWeight = document.querySelector(".card-weight");
const offset = 18; // si cambio este valor me agrega más o menos pokemones a la lista

const guessField = document.getElementById('guessField');
const guessSubmit = document.getElementById('guessSubmit');

var prevPage = null;
var nextPage = null;
var actual = 1;

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

/**me guardo las variables de forma global del paginado */

function listRequest(value) { //Hace el pedido a la Api - value es la URL - para la lista de pokemones
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", value, true);
    xhttp.send();
    xhttp.onreadystatechange = stateChangeHandlerLista;
}

function singleRequest(value) { //Hace el pedido a la Api - value es la URL - para un pokemon
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", value, true);
    xhttp.send();
    xhttp.onreadystatechange = stateChangeHandlerSingle;
}

function stateChangeHandlerSingle() {
    if (this.readyState == 4) {
        if (this.status == 200) {
            let pokeObj = JSON.parse(this.responseText);
            let img = "";
            if (pokeObj.id >= 650) {
                img = imageRoot2 + pokeObj.id + ".png";
            } else {
                img = imageRoot + pokeObj.id + ".svg";
            }
            const pokemon = {
                name: pokeObj.name,
                id: pokeObj.id,
                image: img,
                type: pokeObj.types.map((type) => type.type.name),
                exp:pokeObj.base_experience,
                weight:pokeObj.weight,
                height:pokeObj.height
            }
            actual = pokemon.id;  // asi podemos conjugar la elección del pokemon entre el "atras-siguiente", y elegirlo directamente
            pokeimg.src = `${pokemon.image}`;
            pokeName.textContent = `${pokemon.id}. ${pokemon.name}`;
            pokeType.textContent = `Type: ${pokemon.type}`;
            pokeExp.textContent = `Exp: ${pokemon.exp}`;
            pokeHeight.textContent = `Height: ${pokemon.height}`;
            pokeWeight.textContent = `Weight: ${pokemon.weight}`;
        } else if (this.status == 404) {
            alert('No existe ese pokemon');
        }
    }
}

function crearNodosLista(offset){
    for(let i = 0; i < offset; i++){
        var node = document.createElement("li");
        node.classList.add("nodoPokeLista");
        idPokeLista.appendChild(node);
        nodos[i].addEventListener("click", function () {
            elegirPoke(this.textContent);
        })
    }
}

function stateChangeHandlerLista() {
    if (this.readyState == 4 && this.status == 200) {
        let pokeObj = JSON.parse(this.responseText);
        nextPage = pokeObj.next;
        prevPage = pokeObj.previous; //Seteo las paginas
        let arrayPokes = pokeObj.results; //Se guarda en un arraglo los pokemones
        for (let i = 0; i < arrayPokes.length; i++) {
            let miPokemon = arrayPokes[i].name; //guardo el nombre del pokemon
            nodos[i].textContent = miPokemon;
        } // Agregando evento al clickear un pokemon
    }
}

function siguientePag() {
    if (nextPage != null) {
        listRequest(nextPage);
    }
}

function anteriorPag() {
    if (prevPage != null) {
        listRequest(prevPage);
    }
}

function anteriorPoke() {
    if (actual > 1) {
        actual--;
        singleRequest(apiRoot + actual);
    }
}

function siguientePoke() {
    if (actual < 1118) {
        actual++;
        singleRequest(apiRoot + actual);
    }
}

function elegirPoke(dato) { //Llamado para seleccionar un pokemon por el nombre
    singleRequest(apiRoot + dato);
}

function buscarPoke() {
    let dato = String(guessField.value).toLowerCase();
    if (dato != '') {
        elegirPoke(dato);
    } else {
        alert('Ingresá un valor antes de buscar.')
    }
};

crearNodosLista(offset);
listRequest(`https://pokeapi.co/api/v2/pokemon?limit=${offset}&offset=0`);
singleRequest(apiRoot + actual);