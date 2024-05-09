// El arreglo de aliados está basado en la clase de Cola
var aliados = new Cola();
// El arreglo de enemigos está basado en la clase de Pila
var enemigos = new Pila();

var i = 0;
var j = 0;
var victorias = 0;
var derrotas = 0;

// Este arreglo es solo para algunas funciones estéticas
var perdedores = [];

// Con esta función es que se hace la petición a la API
async function Show() {
    await fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151')
        .then(response => response.json())
        .then(data => { console.log(data.count); info = data })

    // Luego de esto se llama a la función que muestra las opciones
    Opciones();
}

// Esta función es la que muestra las opciones de pokemon
function Opciones() {
    // Obtiene los elementos del HTML
    var pokemon1 = document.getElementById("pokemon1");
    var pokemon2 = document.getElementById("pokemon2");
    var pokemon3 = document.getElementById("pokemon3");

    // Recorre el arreglo de pokemon y crea un elemento option por cada uno
    info.results.forEach(pokemon => {
        const option = document.createElement('option');
        option.text = pokemon.name;
        pokemon1.appendChild(option);
    });

    // Hace lo mismo para el segundo select
    info.results.forEach(pokemon => {
        const option = document.createElement('option');
        option.text = pokemon.name;
        pokemon2.appendChild(option);
    });

    // Y para el tercero
    info.results.forEach(pokemon => {
        const option = document.createElement('option');
        option.text = pokemon.name;
        pokemon3.appendChild(option);
    });
}

// Esta función se llama cuando se presiona el botón de "Listo"
function Listo() {
    // Se obtiene los valores que el ususario haya ingresado
    var pokemon1 = document.getElementById("pokemon1");
    var pokemon2 = document.getElementById("pokemon2");
    var pokemon3 = document.getElementById("pokemon3");

    // Se verifica que no se hayan seleccionado los mismos pokemon
    if (pokemon1.value != pokemon2.value && pokemon1.value != pokemon3.value && pokemon2.value != pokemon3.value) {

        // Se agregan los pokemon a la cola
        aliados.Unshift(info.results[pokemon1.selectedIndex]);
        aliados.Unshift(info.results[pokemon2.selectedIndex]);
        aliados.Unshift(info.results[pokemon3.selectedIndex]);

        // Se conseguirán 3 pokemones aleatorios para los enemigos
        for (let i = 0; i < 3; i++) {
            // Se genera un número aleatorio entre 0 y 150 que no sea uno de los ya seleccionados por el usuario
            do {
                var pokemon = Random();
            } while (pokemon == pokemon1.selectedIndex && pokemon == pokemon2.selectedIndex && pokemon == pokemon3.selectedIndex);
            // Se agrega el pokemon a la pila de los enemigos
            enemigos.Push(info.results[pokemon]);
        }

        // Se oculta el select y el botón
        var seleccion = document.getElementById("seleccion");
        seleccion.style.display = "none";

        // Se detiene la música de intro
        var intro = document.getElementById("intro");
        intro.pause();

        // Se muestra la pantalla de pelea
        Mostrar();
    } else {
        // En caso de que se hayan seleccionado los mismos pokemon se muestra un alert
        alert("No puedes seleccionar el mismo pokemon");
    }
}

// Función para la pantalla de pelea
async function Mostrar() {
    // Se obtienen los elementos del HTML
    var poke1 = document.getElementById("poke1");
    var poke2 = document.getElementById("poke2");
    var poke3 = document.getElementById("poke3");

    // Se obtienen los datos de los pokemon aliados
    const [a1, a2, a3] = await Promise.all([
        fetch(aliados.Queue[0].url).then(response => response.json()),
        fetch(aliados.Queue[1].url).then(response => response.json()),
        fetch(aliados.Queue[2].url).then(response => response.json())
    ]);

    // Se muestran los datos de los pokemon aliados
    // En caso de que el pokemon haya perdido una pelea su imagen se mostrará al revés y le nombre en rojo
    if (perdedores.includes(aliados.Queue[0].name)) {
        poke1.innerHTML = `
        <h1>Tus pokemon</h1>
        <h2 id='loser'>${a1.name.toUpperCase()}</h2>
        <img src="${a1.sprites.back_default}" height="100" alt="${a1.name}">
    `;
    } else {
        // Si no ha perdido o no ha peleado se muestra normal
        poke1.innerHTML = `
        <h1>Tus pokemon</h1>
        <h2>${a1.name.toUpperCase()}</h2>
        <img src="${a1.sprites.front_default}" height="100" alt="${a1.name}">
    `;
    }

    // Lo mismo se hace para el segundo pokemon
    if (perdedores.includes(aliados.Queue[1].name)) {
        poke2.innerHTML = `
        <h2 id='loser'>${a2.name.toUpperCase()}</h2>
        <img src="${a2.sprites.back_default}" height="100" alt="${a2.name}">
    `;
    } else {
        poke2.innerHTML = `
        <h2>${a2.name.toUpperCase()}</h2>
        <img src="${a2.sprites.front_default}" height="100" alt="${a2.name}">
    `;
    }

    // Y para el tercero
    if (perdedores.includes(aliados.Queue[2].name)) {
        poke3.innerHTML = `
        <h2 id='loser'>${a3.name.toUpperCase()}</h2>
        <img src="${a3.sprites.back_default}" height="100" alt="${a3.name}">
    `;
    } else {
        poke3.innerHTML = `
        <h2>${a3.name.toUpperCase()}</h2>
        <img src="${a3.sprites.front_default}" height="100" alt="${a3.name}">
    `;
    }

    // Este permite que la música de pelea se reproduzca solo la primera vez, además se muestra el VS
    if (i == 0 && j == 0) {
        var vs = document.getElementById("vs");
        vs.innerHTML = `
        <h1>VS</h1>
        <audio id="fight" autoplay>
        <source src="pelea.mp3" type="audio/mpeg">
        </audio>
    `;
    }

    // Se obtienen los elementos del HTML
    var ene1 = document.getElementById("ene1");
    var ene2 = document.getElementById("ene2");
    var ene3 = document.getElementById("ene3");

    // Se obtienen los datos de los pokemon enemigos
    const [e1, e2, e3] = await Promise.all([
        fetch(enemigos.Stack[0].url).then(response => response.json()),
        fetch(enemigos.Stack[1].url).then(response => response.json()),
        fetch(enemigos.Stack[2].url).then(response => response.json())
    ]);

    // Se muestran los datos de los pokemon enemigos
    // En caso de que el pokemon haya perdido una pelea su imagen se mostrará al revés y le nombre en rojo
    if (perdedores.includes(enemigos.Stack[0].name)) {
        ene1.innerHTML = `
        <h1>Enemigos</h1>
        <h2 id='loser'>${e1.name.toUpperCase()}</h2>
        <img src="${e1.sprites.back_default}" height="100" alt="${e1.name}">
    `;
    } else {
        // Si no ha perdido o no ha peleado se muestra normal
        ene1.innerHTML = `
        <h1>Enemigos</h1>
        <h2>${e1.name.toUpperCase()}</h2>
        <img src="${e1.sprites.front_default}" height="100" alt="${e1.name}">
    `;
    }

    // Lo mismo se hace para el segundo pokemon
    if (perdedores.includes(enemigos.Stack[1].name)) {
        ene2.innerHTML = `
        <h2 id='loser'>${e2.name.toUpperCase()}</h2>
        <img src="${e2.sprites.back_default}" height="100" alt="${e2.name}">
    `;
    } else {
        ene2.innerHTML = `
        <h2>${e2.name.toUpperCase()}</h2>
        <img src="${e2.sprites.front_default}" height="100" alt="${e2.name}">
    `;
    }

    // Y para el tercero
    if (perdedores.includes(enemigos.Stack[2].name)) {
        ene3.innerHTML = `
        <h2 id='loser'>${e3.name.toUpperCase()}</h2>
        <img src="${e3.sprites.back_default}" height="100" alt="${e3.name}">
    `;
    } else {
        ene3.innerHTML = `
        <h2>${e3.name.toUpperCase()}</h2>
        <img src="${e3.sprites.front_default}" height="100" alt="${e3.name}">
    `;
    }

    // Se obtiene el elemento del HTML y se crea el botón que los hace pelear
    var pelea = document.getElementById("pelea");
    pelea.innerHTML = `
        <button onclick="Pelea()">PELEAR</button>
    `;

}

// Función para la pelea
async function Pelea() {
    // Se obtienen los datos de los pokemon aliados
    const [a] = await Promise.all([
        fetch(aliados.Queue[i].url).then(response => response.json())
    ]);

    // Se obtienen los datos de los pokemon enemigos
    const [e] = await Promise.all([
        fetch(enemigos.Stack[j].url).then(response => response.json())
    ]);

    // Se obtiene el elemento del HTML
    var ganador = document.getElementById("ganador");

    // Se compara la experiencia base de los pokemon, el que tenga mayor será el ganador
    if (a.base_experience > e.base_experience) {
        // Se guarda el nombre del pokemon ganador en la variable win
        var win = a.name;
        // Como ganó le pokemon aliado se le suma una victoria
        victorias++;
        // Se guarda el nombre del pokemon perdedor en el arreglo perdedores
        perdedores.push(e.name);
    } else {
        // Si ganó el pokemon enemigo se guarda su nombre en la variable win
        var win = e.name;
        // Como ganó el pokemon enemigo se le suma una derrota
        derrotas++;
        // Se guarda el nombre del pokemon perdedor en el arreglo perdedores
        perdedores.push(a.name);
    }

    // Se aumenta el contador de i y j
    i++;
    j++;

    // Se muestra el ganador de la pelea
    ganador.innerHTML = `
    <h5>El ganador de la pelea es:</h5>
    <h3>${win.toUpperCase()}</h3>
    `;

    // Si la longitud de perdedores no es 3 quiere decir que no se han hecho todas las peleas
    if (perdedores.length == 3) {
        // Se llama una vez más la función Mostrar para que se muestre el resultado de la última pelea
        Mostrar();
        // El botón de pelear desaparece
        pelea.style.display = "none";

        // Se pausa la música de pelea
        var fight = document.getElementById("fight");
        fight.pause();

        // Se obtiene el elemento del HTML
        var final = document.getElementById("final");

        // Se muestra el resultado final
        if (victorias > derrotas) {
            // En caso de haber ganado se muestra un mensaje de victoria, se cuentan el número de victorias y
            // derrotas y se reproduce la música de victoria
            final.innerHTML = `
            <h1>¡GANASTE!</h1>
            <h2>Victorias: ${victorias}</h2>
            <h2>Derrotas: ${derrotas}</h2>
            <audio autoplay>
            <source src="victory.mp3" type="audio/mpeg">
            </audio>
            `;
        } else {
            // En caso de haber perdido se muestra un mensaje de derrota, se cuentan el número de victorias y
            // derrotas y se reproduce la música de derrota
            final.innerHTML = `
            <h1>¡PERDISTE!</h1>
            <h2>Victorias: ${victorias}</h2>
            <h2>Derrotas: ${derrotas}</h2>
            <audio autoplay>
            <source src="lose.mp3" type="audio/mpeg">
            </audio>
            `;
        }

        // Se muestra un botón para reiniciar el juego
        var reinicio = document.getElementById("reinicio");
        reinicio.innerHTML = `
            <button onclick="Reiniciar()">Reiniciar</button>
        `;
    } else {
        // Se vuelve a llamar a la función Mostrar
        Mostrar();
    }
}

// Función para reiniciar el juego
function Reiniciar() {
    // Se recarga la página
    location.reload()
}

// Función para generar un número aleatorio entre 0 y 150
function Random() {
    return Math.floor(Math.random() * 150);
}