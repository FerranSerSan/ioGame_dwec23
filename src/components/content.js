export { renderContent, traurerTipoCelda, actualizarPuntuacio};

import { interval } from 'rxjs';

const TABLERO_LENGTH = 78;                // Longitud del tablero 
const JUGADOR_ACTUAL = "Jugadorx";        // Nom del jugador
const TEMPS = 30;                       // tems expresat en segons que dura la partida
const PENALIZACION_MADRIGUERA = 3;        // segons que se resten al apretar la madriguera
const PENALIZACION_COLOR_INCORRECTE = 5;  // segons que se resten al apretar el topo incorrecte
const TIPOS_CELDA = {                     // tots els tipos de celdes "Topos" que hi han
  madriguera: 0,
  topoMorado: 1,
  topoAzul: 2,
  topoRojo: 3,
  topoRosa: 4,
  topoGris: 5,
  topoAmarillo: 6,
  topoVerde: 7,
  topoNaranja: 8,
  topoNegro: 9,
  topoBlanco: 10,
  topoOro:11
};

// Estat per defecte del joc
// conte variables que se utilitzen a lo llarg del codi
function defaultState() {
  return {
    puntuacio: 0,                                                 // La puntuacio del jugador
    tempsRestant: TEMPS,                                          // el temps restant que li queda a la partida
    tablero: Array(TABLERO_LENGTH).fill(TIPOS_CELDA.madriguera),  // el "tablero" conte informacio de el tipo de celda que te (expresat en numeros)
    colorTopoActual: colorAleatori(),                             // el "valor" del topo al que hi ha que atrapar, (expresat en numeros)
    topo: generarPosicionsTopo()                                  // un Array on es guarda el tipo de celda que es, i la seua posicio en el tablero
  };
}

// genera un numero aleatori per a asignarlo a el topo al que hi ha que capturar
// del array de tipos de celda, tria un index que no siga 0, per a que no ixca el index de la madriguera
function colorAleatori() {
  const colores = Object.values(TIPOS_CELDA).filter(v => v !== TIPOS_CELDA.madriguera);
  const index = Math.floor(Math.random() * colores.length);
  return colores[index];
}

// Crea un array amb tots els colors disponibles:
// - colores: [1,2,3,4,5,6,7]
// Recorre el array y li dona a cada color una posicion aleatoria del tablero que no estiga utilitzada
// - posiciones: { 1: 14, 2: 10, 3: 64, 4: 74, 5: 2, 6: 5, 7: 23 }
// retorna el objecte posicions y es guarda en status.topo
function generarPosicionsTopo() {
  const colores = Object.values(TIPOS_CELDA).filter(v => v !== TIPOS_CELDA.madriguera);
  const posiciones = {};
  const usados = new Set();

  colores.forEach(color => {
    let pos;
    do {
      pos = Math.floor(Math.random() * TABLERO_LENGTH);
    } while (usados.has(pos));
    usados.add(pos);
    posiciones[color] = pos;
  });

  return posiciones;
}

// Suma un valor a la puntuacio del state y retorna la nova puntuacio
function actualizarPuntuacio(state, delta) {
  const valorActualizat = Math.max(0, state.puntuacio + delta);
  return {
    ...state,
    puntuacio: valorActualizat
  };
}

// Resta un valor al temps del state y retoran el nou temps
function restaTemps(state, deltaSegundos) {
  const nuevoTemps = Math.max(0, state.tempsRestant - deltaSegundos);
  return {
    ...state,
    tempsRestant: nuevoTemps
  };
}

// comprova si el temps del state es menor o igual a 0
// retorna true si se ha acabat el temps o false si encara no
function seHaAcabatElTemps(state) {
  return state.tempsRestant <= 0;
}

// crea una copia del tablero actual pera a no modificar el original
// - [0,0,0,0,3,0,0,0,0,0,0,1,0...]
// el plena de madrigueres, per a borrar els topos (tot a 0)
// - [0,0,0,0,0,0,0,0,0,0,0,0,0...]
// recorre el objecte topos que conte { color: posicion }
// - { 1: 14, 2: 10, 3: 64, 4: 74, 5: 2, 6: 5, 7: 23 }
// obte la posicio de cada topo y el añadix a la copia del tablero
// - [0,0,5,0,0,6,0,0,0,0,2,0,0...]
// retorna el tablero nou

function renderTablero(tableroActual, topos) {
  const tableroCopia = [...tableroActual];
  tableroCopia.fill(TIPOS_CELDA.madriguera);

  for (const color in topos) {
    const pos = topos[color];
    if (pos >= 0 && pos < TABLERO_LENGTH) {
      tableroCopia[pos] = parseInt(color);
    }
  }

  return tableroCopia;
}

// Genera el HTML del tablero
// Guarda en una array el tablero nou amb les posicions dels topos 
// despues se mappea el array per a crear el HTML per cada celda
// - div.board-cell: contenedor de la celda amb classe dinamica (ej: 'topoMorado', 'madriguera')
// - button.topo-button: boto amb id per a identificar la posicio clicada
// per ultim, envia tots els htmls en un string, que se añadira al DOM
function renderTableroHTML(tableroActual, topos) {
  tableroActual = renderTablero(tableroActual, topos);

  return tableroActual.map((posicion, i) => {
    const colorClass = Object.keys(TIPOS_CELDA).find(key => TIPOS_CELDA[key] === posicion);
    return `<div class="board-cell ${colorClass}" id="div${i}">
              <button class="topo-button" id="${i}"></button>
            </div>`;
  }).join('');
}

// HTML complet del joc
// primer dibuixa la puntuacio, despres el div on es mostra el topo objectiu, finalment el tablero
function buildHTML(state) {
  return buildPuntuacio(state) +
    buildColorTopoObjectiu(state) +
    buildTablero(state);
}
// Retorna el html per a la puntuacio, on es mostra els punts que porta el jugador y el temps restant
// arreplega les dades del state modificat que li se passa a la funcio
function buildPuntuacio(state) {
  return `
  <div class="puntuacio">
      <div><span>Puntuacio:</span> <span id="puntuacio-valor">${state.puntuacio}</span></div>
      <div><span>Temps restant:</span> <span id="temps-restant">${state.tempsRestant}s</span></div>
    </div>
    `;
}

// Retorna el HTML del div que mostra el color del topo objectiu
// Busca el nom de la classe CSS corresponent al número del color actual (state.colorTopoActual)
// Exemple: si colorTopoActual=1 → busca TIPOS_CELDA[key]===1 → troba 'topoMorado'
// Aplica aquesta classe al div per mostrar el color que el jugador ha de capturar
function buildColorTopoObjectiu(state) {
  const colorClave = Object.keys(TIPOS_CELDA).find(
    key => TIPOS_CELDA[key] === state.colorTopoActual
  );

  return `
  <div class="color-Topo">
    <div class="${colorClave}" id="color-objetivo"></div>
  </div>`;
}

// Retorna el HTML del contenidor del tablero de joc
// Crida a renderTableroHTML per generar les celdes amb els topos en les seues posicions
// La estructura de divs crea el layout: container → board-wrapper → game-area → board
function buildTablero(state) {
  return `
    <div class="container">
      <div class="board-wrapper">
        <div class="game-area">
          <div class="board">
            ${renderTableroHTML(state.tablero, state.topo)}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Retorna el HTML del boto de guardar la partida
function htmlbotoGuardar() {
  return `
    <div class="guardar-partida">
      <button id="guardar-button" class="guardar-button">Guardar partida</button>
    </div>
  `;
}

// Función principal que retorna el html de tot el joc
// es crea el div "root", on se añadira tota la extructura del html que se genera amb les altres funcions
function renderContent() {
  const root = document.createElement('div');
  root.className = 'topo-game-root';
  renderInici(root);
  return root;
}

// Pantalla de inici
// HTML amb les regles del joc i el boto per a començar la partida
// al boto se li afegis un listener que crida a render joc i li envia el defaultstate com a parametre
function renderInici(root) {
  const regles = {
    1: {
      info: `Fes clic al topo del color que apareix a la part superior`,
      valor: `+1`
    },
    2: {
      info: `Fer clic a una madriguera`,
      valor: PENALIZACION_MADRIGUERA
    },
    3: {
      info: `Fer clic a un topo d'un altre color`,
      valor: PENALIZACION_COLOR_INCORRECTE
    },
    4: {
      info: `El joc acaba quan s'acaba el temps. Bona sort!`,
      valor: ""
    }
  };

  let reglesHTML = "";
  for (const key in regles) {
    reglesHTML += `
      <div class="rule">
        <span class="rule-text">${regles[key].info}</span>
        <span class="rule-score">${regles[key].valor}</span>
      </div>
    `;
  }

  root.innerHTML = `
    <div class="title"> Atrapa El topo </div>
    <div class="regles">
      <h2>Regles del joc</h2>
      ${reglesHTML}
    </div>
    
    <div class="pantalla-inici">
      <button id="start-button" class="start-button">Començar partida</button>
    </div>
  `;

  const startBtn = root.querySelector('#start-button');
  startBtn.addEventListener('click', () => {
    const newState = defaultState();
    renderJoc(root, newState);
  });
}


// a esta funcio se li pasa la posicio del boto al que se ha apretat per a comprovar si en el array de topos hi ha algin topo en ixa pocicio
// - si en ixa posicio hi ha algun topo, es retorna el id del topo al que li se ha fet click
// - si no, es retorna el id de la madriguera, que es 0
// id es el valor de una clase que li se asigna al boto del topo, servix per a saber a quin boto ha fet click
function traurerTipoCelda(id, topos) {
  for (const color in topos) {
    if (topos[color] === id) {
      return parseInt(color, 10);
    }
  }
  return TIPOS_CELDA.madriguera;
}


// esta funcio actualiza el div on es mostra el temps restant y la puntuacio del jugador
// sols es crida cuant se executa cuant es fa click a un boto del tablero
function actualizarUI(root, state, tempsRestant) {
  const spanPuntuacio = root.querySelector('#puntuacio-valor');
  if (spanPuntuacio) spanPuntuacio.textContent = String(state.puntuacio);
  
  const spanTemps = root.querySelector('#temps-restant');
  if (spanTemps) spanTemps.textContent = `${tempsRestant}s`;
}

// Esta funcio es un intento de animacio
// plena el tablero de madrigueres cridant a render tablero en el tablero tot a 0
// esta funcio esta dins de un setTimeout, per a que es mostre durant un temps
function plenarMadrigueres(root) {
  console.log("espera");
  const boardDiv = root.querySelector('.board');
  const tableroAmagat = Array(TABLERO_LENGTH).fill(TIPOS_CELDA.madriguera);
  boardDiv.innerHTML = renderTableroHTML(tableroAmagat, {});
}


// Se li pasa el state actual i el element root on es dibuixa el tablero. 
// Trau el estat del tablero i crida a la funcio que el dibuixa.
// guarda en una variable el "id" del topo al que hi ha que atrapar.
// despres cambia la clase del div on es mostra el topo per a cambiar la imatge del topo.
function actualizarTableroIColor(root, state) {
  const boardDiv = root.querySelector('.board');
  if (boardDiv) {
    boardDiv.innerHTML = renderTableroHTML(state.tablero, state.topo);
  }

  const colorDiv = root.querySelector('#color-objetivo');
  if (colorDiv) {
    const colorClave = Object.keys(TIPOS_CELDA).find(
      key => TIPOS_CELDA[key] === state.colorTopoActual
    );
    colorDiv.className = colorClave;
  }
}


// esta funcio fa un unsubscribe al contador, per a que deixe de actualizarse
// despres mostra un missatge amb la puntuacio del jugador 
// despres crida a la funcio que mostra el boto de començar la partida
function finalizarJoc(root, timerSub, puntuacio) {
  if (timerSub) timerSub.unsubscribe();
  alert(`La puntuació final de ${JUGADOR_ACTUAL} és ${puntuacio}.`);
  renderInici(root);
}

// ----------------------renderJoc-------------------------------------

function renderJoc(root, currentState) {
  // afegis en el div root el html del joc i el boto per a guardar
  root.innerHTML = buildHTML(currentState) + htmlbotoGuardar();

  // variable que guarda el temps restant
  let tempsRestant = currentState.tempsRestant;

  // variable que referencia a la subscripcio del temporizador
  let timerSub = null;

  // si ya existix un temporizador, cancela la subscripcio, per a que no es dupliquen els temporizadors
  if (timerSub) timerSub.unsubscribe();
  
  // es crea el temporizador que cada segon: 
  // - resta 1
  // - actualiza el state afegint el temps que queda
  // - cambia el contingut del span on es mostra el temps restant
  // - comprova si se ha acabat el temps
  timerSub = interval(1000).subscribe(() => {

    // resta el temps pero mai baixa de 0
    tempsRestant = Math.max(0, tempsRestant - 1);

    // actualiza el temps en el state
    currentState.tempsRestant = tempsRestant;

    // cambia el contingut del span que mostra el temps per a que mostre el temps que queda
    const timeSpan = root.querySelector('#temps-restant');
    if (timeSpan) timeSpan.textContent = `${tempsRestant}s`;

    // si el temps aplega a 0, crid a la funcio que acaba el joc
    if (tempsRestant <= 0) {
      finalizarJoc(root, timerSub, currentState.puntuacio);
    }
  });


  // obte el contenidor on es dibuixa el joc
  const gameArea = root.querySelector('.game-area');

  // agrega el listener de click al contenidor on esta el tablero
  // aixina no hi ha que fer un listener a cada boto
  gameArea.addEventListener('click', (ev) => {

    // busca el element al que se ha fet click
    const boton = ev.target.closest('.topo-button');

    // si no se ha fet click en un boto, fa un return per a acabar
    if (!boton) return;

    // si se ha fet click en un boto, guarda el id del boto (posicio del boto) en una variable
    const id = parseInt(boton.id);
    
    // Guarda en una variable el tipo de celda que es el boto al que has apretat.
    // exemple:
    // 0 -> madriguera
    // 3 -> topo
    const tipoDeCelda = traurerTipoCelda(id, currentState.topo);

    // comprovar aon se ha fet click
    //
    // Click en el topo que hi ha que capturar
    if (tipoDeCelda === currentState.colorTopoActual) {
      // se crida a la funcio que suma la puntuacio
      currentState = actualizarPuntuacio(currentState, +1);

      // Click en la madriguera buida
    } else if (tipoDeCelda === TIPOS_CELDA.madriguera) {
      // se crida a la funcio que resta el temps
      currentState = restaTemps(currentState, PENALIZACION_MADRIGUERA);

      // Click en el topo incorrecte
    } else {
      // se crida a la funcio que resta el temps
      currentState = restaTemps(currentState, PENALIZACION_COLOR_INCORRECTE);
    }

    // Despues de modificar el temps o la puntuacio, se guarda en una variable
    tempsRestant = currentState.tempsRestant;

    // actualiza el UI despues de modificar el temps i la puntuacio
    actualizarUI(root, currentState, tempsRestant);

    // verifica si el temps es menor o igual a 0 despres del click
    if (tempsRestant <= 0) {
      // crida la funcio que acaba el joc
      finalizarJoc(root, timerSub, currentState.puntuacio);
      return;
    }

    // Oculta els topos del tablero temporalment
    plenarMadrigueres(root);

    // Espera 350ms antes de actualitzar el tablero
    setTimeout(() => {
      // verifica si se ha acabat el temps durant la pausa
      if (seHaAcabatElTemps(currentState)) {
        // si se a acabat el temps, el joc se acaba
        finalizarJoc(root, timerSub, currentState.puntuacio);
        return;
      }

      // Genera un estat nou per a la seguent ronda
      // genera les posicions aleatories per als topos
      currentState.topo = generarPosicionsTopo();
      // genera internament al topo que hi ha que atrapar
      currentState.colorTopoActual = colorAleatori();
      
      // mostra els datos en el html
      actualizarTableroIColor(root, currentState);
    }, 350);
  });
}