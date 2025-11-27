export { renderContent, comprobarClickEnTopo, actualizarPuntuacio};

import { interval } from 'rxjs';

const TABLERO_LENGTH = 91;
const JUGADOR_ACTUAL = "Jugadorx";
const TEMPS = 3000; // segons
const PENALIZACION_MADRIGUERA = 3; // segons que se resten
const PENALIZACION_COLOR_INCORRECTE = 5; // segons que se resten
const TIPOS_CELDA = {
  madriguera: 0,
  topoMorado: 1,
  topoAzul: 2,
  topoRojo: 3,
  topoRosa: 4,
  topoGris: 5,
  topoAmarillo: 6,
  topoVerde: 7
};

// Estat per defecte
function defaultState() {
  return {
    puntuacio: 0,
    tempsRestant: TEMPS,
    tablero: Array(TABLERO_LENGTH).fill(TIPOS_CELDA.madriguera),
    colorTopoActual: colorAleatori(),
    topo: generarPosicionsTopo()
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
function actualizarTemps(state, deltaSegundos) {
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

// Genera HTML de cada celda
function renderTableroString(tableroActual, topos) {
  tableroActual = renderTablero(tableroActual, topos);

  return tableroActual.map((posicion, i) => {
    const colorClass = Object.keys(TIPOS_CELDA).find(key => TIPOS_CELDA[key] === posicion);
    return `<div class="board-cell ${colorClass}" id="div${i}">
              <button class="topo-button" id="${i}"></button>
            </div>`;
  }).join('');
}

// HTML completo del juego
function buildHTML(state) {
  return buildPuntuacio(state) +
    buildColorTopo(state) +
    buildTablero(state);
}

function buildPuntuacio(state) {
  return `
  <div class="puntuacio">
      <div><span>Puntuacio:</span> <span id="puntuacio-valor">${state.puntuacio}</span></div>
      <div><span>Temps restant:</span> <span id="temps-restant">${state.tempsRestant}s</span></div>
    </div>
    `;
}

function buildColorTopo(state) {
  const colorClave = Object.keys(TIPOS_CELDA).find(
    key => TIPOS_CELDA[key] === state.colorTopoActual
  );

  console.log("Color topo actual: " + colorClave);
  return `
  <div class="color-Topo">
    <div class="${colorClave}" id="color-objetivo"></div>
  </div>`;
}

function buildTablero(state) {
  return `
    <div class="container">
      <div class="board-wrapper">
        <div class="game-area">
          <div class="board">
            ${renderTableroString(state.tablero, state.topo)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function htmlbotoGuardar() {
  return `
    <div class="guardar-partida">
      <button id="guardar-button" class="guardar-button">Guardar partida</button>
    </div>
  `;
}

// Función principal
function renderContent() {
  const root = document.createElement('div');
  root.className = 'topo-game-root';
  renderInici(root);
  return root;
}

// Pantalla de inicio
function renderInici(root) {
  root.innerHTML = `
    <div class="title"> Atrapa El topo </div>
    <div class="regles">
      <h2>Regles del joc</h2>
      <div class="rule"><span class="rule-text">Fes clic al topo del color que apareix a la part superior</span><span class="rule-score">+1p</span></div>
      <div class="rule"><span class="rule-text">Fer clic a una madriguera</span><span class="rule-score">-${PENALIZACION_MADRIGUERA}s</span></div>
      <div class="rule"><span class="rule-text">Fer clic a un topo d'un altre color</span><span class="rule-score">-${PENALIZACION_COLOR_INCORRECTE}s</span></div>
      <p class="rule-note">El joc acaba quan s'acaba el temps. Bona sort!</p>
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

// Comprobar en qué tipo de celda se hizo clic
function comprobarClickEnTopo(id, topos) {
  for (const color in topos) {
    if (topos[color] === id) {
      return parseInt(color, 10);
    }
  }
  return TIPOS_CELDA.madriguera;
}

// Actualizar UI de puntuación y tiempo
function actualizarUI(root, state, remaining) {
  const scoreSpan = root.querySelector('#puntuacio-valor');
  if (scoreSpan) scoreSpan.textContent = String(state.puntuacio);
  
  const timeSpan = root.querySelector('#temps-restant');
  if (timeSpan) timeSpan.textContent = `${remaining}s`;
}

// Ocultar tablero temporalmente
function ocultarTablero(root) {
  const boardDiv = root.querySelector('.board');
  const tableroAmagat = Array(TABLERO_LENGTH).fill(TIPOS_CELDA.madriguera);
  boardDiv.innerHTML = renderTableroString(tableroAmagat, {});
}

// Actualizar tablero y color objetivo
function actualizarTableroYColor(root, state) {
  const boardDiv = root.querySelector('.board');
  if (boardDiv) {
    boardDiv.innerHTML = renderTableroString(state.tablero, state.topo);
  }

  const colorDiv = root.querySelector('#color-objetivo');
  if (colorDiv) {
    const colorClave = Object.keys(TIPOS_CELDA).find(
      key => TIPOS_CELDA[key] === state.colorTopoActual
    );
    colorDiv.className = colorClave;
  }
}

// Finalizar juego
function finalizarJoc(root, timerSub, puntuacio) {
  if (timerSub) timerSub.unsubscribe();
  alert(`La puntuació final de ${JUGADOR_ACTUAL} és ${puntuacio}.`);
  renderInici(root);
}


// Pantalla del juego
function renderJoc(root, currentState) {
  root.innerHTML = htmlbotoGuardar() + buildHTML(currentState);

  // Referencia compartida para el timer y remaining
  let remaining = currentState.tempsRestant;
  let timerSub = null;

  // Iniciar temporizador
  if (timerSub) timerSub.unsubscribe();
  
  timerSub = interval(1000).subscribe(() => {
    remaining = Math.max(0, remaining - 1);
    currentState.tempsRestant = remaining;

    const timeSpan = root.querySelector('#temps-restant');
    if (timeSpan) timeSpan.textContent = `${remaining}s`;

    if (remaining <= 0) {
      finalizarJoc(root, timerSub, currentState.puntuacio);
    }
  });

  // Event delegation para los clicks en el tablero
  const gameArea = root.querySelector('.game-area');
  gameArea.addEventListener('click', (ev) => {
    const boton = ev.target.closest('.topo-button');
    if (!boton) return;

    const id = parseInt(boton.id);
    
    // Comprobar en qué se hizo clic
    const clickEnTopo = comprobarClickEnTopo(id, currentState.topo);
    
    // Actualizar estado según el click
    if (clickEnTopo === currentState.colorTopoActual) {
      currentState = actualizarPuntuacio(currentState, +1);
    } else if (clickEnTopo === TIPOS_CELDA.madriguera) {
      currentState = actualizarTemps(currentState, PENALIZACION_MADRIGUERA);
    } else {
      currentState = actualizarTemps(currentState, PENALIZACION_COLOR_INCORRECTE);
    }

    // Sincronizar remaining con el state
    remaining = currentState.tempsRestant;

    // Actualizar UI
    actualizarUI(root, currentState, remaining);

    // Verificar si se acabó el tiempo por el click
    if (remaining <= 0) {
      finalizarJoc(root, timerSub, currentState.puntuacio);
      return;
    }

    // Ocultar tablero temporalmente
    ocultarTablero(root);

    // Esperar 300ms antes de actualizar el tablero
    setTimeout(() => {
      if (seHaAcabatElTemps(currentState)) {
        finalizarJoc(root, timerSub, currentState.puntuacio);
        return;
      }

      // Generar nuevo estado
      currentState.topo = generarPosicionsTopo();
      currentState.colorTopoActual = colorAleatori();
      
      // Actualizar tablero y color
      actualizarTableroYColor(root, currentState);
    }, 300);
  });
}