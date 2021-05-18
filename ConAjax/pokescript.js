const idPokeLista = document.getElementById("pokelista"); // id => pokelista
const idShowPokemon = document.getElementById("showPokemon");
const guessSubmit = document.getElementById("guessSubmit");
const pokeimg = document.getElementById("pokemon-img");
const pokename = document.getElementById("pokemon-name");
const poketype = document.getElementById("pokemon-type");
const pokestats = document.getElementById("pokemon-stats");
var prevPage = null;
var nextPage = null; 
const apiRoot = "https://pokeapi.co/api/v2/pokemon/";
var actual = 1;


/**me guardo las variables de forma global del paginado */


//Funciones

function listRequest (value){ //Hace el pedido a la Api - value es la URL - para la lista de pokemones
    var xhttp = new XMLHttpRequest(); 
    xhttp.open("GET", value, true);
    xhttp.send();
    xhttp.onreadystatechange = stateChangeHandlerLista; 
}

function singleRequest (value){ //Hace el pedido a la Api - value es la URL - para un pokemon
    var xhttp = new XMLHttpRequest(); 
    xhttp.open("GET", value, true);
    xhttp.send();
    xhttp.onreadystatechange = stateChangeHandlerSingle;
}

function stateChangeHandlerSingle(){
    if (this.readyState == 4 && this.status == 200){ 
        const pokeObj = JSON.parse(this.responseText);
        console.log(pokeObj);
        const pokemon = {
            name: pokeObj.name,
            id: pokeObj.id,
            image: pokeObj.sprites['front_default'],
            type: pokeObj.types.map((type) => type.type.name),
            stats: pokeObj.stats.map((stats)=>{
                var array = [];
                array.push(stats.stat.name+': '+stats.base_stat);
                return array;
            })
        }
        console.log(pokemon);
        actual = pokemon.id;
        limpiarPokemon();
        agregarPokemon(pokemon);
    }
}


function stateChangeHandlerLista(){
    if (this.readyState == 4 && this.status == 200){       
        let pokeObj = JSON.parse(this.responseText);
        limpiarLista();
        console.log(pokeObj); //Verificacion
        nextPage = pokeObj.next; 
        prevPage = pokeObj.previous; //Seteo las paginas
        let arrayPokes = pokeObj.results; //Se guarda en un arraglo los pokemones
        for (let i=0; i < arrayPokes.length; i++){ 
            let miPokemon = arrayPokes[i].name; //guardo el nombre del pokemon
            var node = document.createElement("li");
            node.classList.add("nodoPokeLista");
            node.textContent=(arrayPokes[i].name);
            node.addEventListener("click", function(){
                elegirPoke(miPokemon);
                }); // Agregando evento al clickear un pokemon
            idPokeLista.appendChild(node); //agrego el elemento creado a la lista <ul>
        }
    }
}


function limpiarPokemon (){ //No es eficiente, verificar luego.
    pokeimg.src = "";
    pokename.textContent ="";
    poketype.textContent = "";
    while (pokestats.firstChild){
        pokestats.removeChild(pokestats.firstChild);
    }
}

function agregarPokemon(pokemon){
    pokeimg.src = pokemon.image;
    let pokeid = pokemon.id;
    pokename.textContent = pokeid.toString().padStart(3, '0')+". "+pokemon.name;
    poketype.textContent = "type: "+pokemon.type;
    for (var i=0; i<pokemon.stats.length;i++){
        var node = document.createElement("li");
        node.textContent=(pokemon.stats[i]);
        pokestats.appendChild(node);
    };
}

function limpiarLista(){
    while (idPokeLista.firstChild){
        idPokeLista.removeChild(idPokeLista.firstChild);
    }
}

function siguientePag (){
    if (nextPage) {
        listRequest(nextPage);
    }
}

function anteriorPag (){
    if (prevPage) {
        listRequest(prevPage);
    }
}

function anteriorPoke(){
    if (actual > 1) {
        actual--;
        singleRequest (apiRoot+actual);
    }
}

function siguientePoke(){
    if (actual < 1118) {
        actual++;
        singleRequest (apiRoot+actual);
    }
}

function elegirPoke(dato){ //Llamado para seleccionar un pokemon por el nombre
    singleRequest (apiRoot+dato);
}

function buscarPoke(){
    let dato = String(guessField.value);
    elegirPoke(dato);
}
 
//Inicio 
addEventListener('click', buscarPoke);
listRequest ("https://pokeapi.co/api/v2/pokemon?limit=12&offset=0");
singleRequest (apiRoot+actual);

const apiRoot = "https://pokeapi.co/api/v2/pokemon/";
const imageRoot = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/';
const imageRoot2 = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const idPokeLista = document.getElementById("pokelista"); // id => pokelista
const idShowPokemon = document.getElementById("showPokemon"); // id => showPokemon
const pokeimg = document.querySelector(".card-image");
const pokeName = document.querySelector(".card-title");
const pokeType = document.querySelector(".card-subtitle");

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
            console.log(pokeObj);
            let img= "";
            if (pokeObj.id >= 650){
                img=imageRoot2+pokeObj.id+".png";
            } else img=imageRoot+pokeObj.id+".svg";
            const pokemon = {
                name: pokeObj.name,
                id: pokeObj.id,
                image: img,
                type: pokeObj.types.map((type) => type.type.name)
            }
            actual = pokemon.id;  // asi podemos conjugar la elección del pokemon entre el "atras-siguiente", y elegirlo directamente
            pokeimg.src = `${pokemon.image}`;
            pokeName.textContent = `${pokemon.id}. ${pokemon.name}`;
            pokeType.textContent = `Type: ${pokemon.type}`;
        } else if (this.status == 404) {
            alert('No existe ese pokemon');
        }
    }
}


function stateChangeHandlerLista() {
    if (this.readyState == 4 && this.status == 200) {
        let pokeObj = JSON.parse(this.responseText);
        limpiarLista();
        console.log(pokeObj); //Verificacion
        nextPage = pokeObj.next;
        prevPage = pokeObj.previous; //Seteo las paginas
        let arrayPokes = pokeObj.results; //Se guarda en un arraglo los pokemones
        console.log(arrayPokes);
        for (let i = 0; i < arrayPokes.length; i++) {
            let miPokemon = arrayPokes[i].name; //guardo el nombre del pokemon
            var node = document.createElement("li");
            node.classList.add("nodoPokeLista");
            node.textContent=(miPokemon);
            node.addEventListener("click", function () {
                elegirPoke(miPokemon);
            }); // Agregando evento al clickear un pokemon
            idPokeLista.appendChild(node); //agrego el elemento creado a la lista <ul>
        }
    }
}

function limpiarLista(){
    while (idPokeLista.firstChild){
        idPokeLista.removeChild(idPokeLista.firstChild);
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
    console.log(dato);
    singleRequest(apiRoot + dato);
}

function buscarPoke() {
    let dato = String(guessField.value).toLowerCase();
    if(dato != ''){
        elegirPoke(dato);
    }else{
        alert('Ingresá un valor antes de buscar.')
    }
};

listRequest("https://pokeapi.co/api/v2/pokemon?limit=18&offset=0");
singleRequest(apiRoot + actual);