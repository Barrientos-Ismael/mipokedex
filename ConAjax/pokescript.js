const idPokeLista = document.getElementById("pokelista"); // id => pokelista
const idShowPokemon = document.getElementById("showPokemon");
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
            stats: pokeObj.stats.map((stats) => stats.stat.name),
            statsValue: pokeObj.stats.map((stats) => stats.base_stat)
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
        node.textContent=(pokemon.stats[i]+": "+pokemon.statsValue[i]);
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
 
//Inicio 

listRequest ("https://pokeapi.co/api/v2/pokemon?limit=12&offset=0");
singleRequest (apiRoot+actual);