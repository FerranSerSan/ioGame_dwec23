export { renderContent };

const TABLERO_LENGTH = 91;
const JUGADOR_ACTUAL = "Ferran";
const TEMPS = 30; // segons
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

// Estado por defecto
function defaultState() {
  return {
    puntuacio: 0,
    tempsRestant: calcularTemps(),
    tablero: Array(TABLERO_LENGTH).fill(TIPOS_CELDA.madriguera),
    colorTopoActual: colorAleatori(),
    topo: generarPosicionsTopo()
  };
}

function calcularTemps() {
  
}

// Color aleatorio
function colorAleatori() {
  const colores = Object.values(TIPOS_CELDA).filter(v => v !== TIPOS_CELDA.madriguera);
  const index = Math.floor(Math.random() * colores.length);
  return colores[index];
}

// Genera posiciones aleatorias de topos
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

// Actualiza puntuación
function actualizarPuntuacio(state, delta) {
  const valorActualizat = Math.max(0, state.puntuacio + delta);
  return {
    ...state,
    puntuacio: valorActualizat
  };
}

function seHaAcabatElTemps(state) {
  // si el temps es 0 o menys, ha acabat
  return state.tempsRestant <= 0;
}

// Renderiza el tablero con topos desde currentState.topo
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
      <div><span>${JUGADOR_ACTUAL}:</span> <span>${state.puntuacio}</span></div>
      <div><span>Temps restant:</span> <span>${state.tempsRestant}s </span></div>
    </div>
    `;
}

function buildColorTopo(state) {
  state.colorTopoActual = colorAleatori();

  const colorClave = Object.keys(TIPOS_CELDA).find(
    key => TIPOS_CELDA[key] === state.colorTopoActual
  );

  console.log("Color topo actual: " + colorClave);
  return `
  <div class="color-Topo">
    <div class="${colorClave}"></div>
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
      <div class="rule"><span class="rule-text">Fer clic a una madriguera</span><span class="rule-score">-1p</span></div>
      <div class="rule"><span class="rule-text">Fer clic a un topo d'un altre color</span><span class="rule-score">-2p</span></div>
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

function htmlbotoGuardar() {
  return `
    <div class="guardar-partida">
      <button id="guardar-button" class="guardar-button">Guardar partida</button>
    </div>
  `;
}

// Pantalla del juego
function renderJoc(root, currentState) {
  root.innerHTML = htmlbotoGuardar() + buildHTML(currentState);

  console.log(currentState.topo);

  root.onclick = (ev) => {
    const boton = ev.target.closest('.topo-button');
    if (!boton) return;
    const id = parseInt(boton.id);

    // Comprobar si se ha clicado en el topo correcto
    let clickedColor = 0;
    for (const color in currentState.topo) {
      if (currentState.topo[color] === id) {
      clickedColor = parseInt(color, 10);
      break;
      }
    }
    if (clickedColor === currentState.colorTopoActual) {
      currentState = actualizarPuntuacio(currentState, +1);
    } else if (clickedColor === TIPOS_CELDA.madriguera) {
      currentState = actualizarPuntuacio(currentState, -1);
    } else {
      currentState = actualizarPuntuacio(currentState, -2);
    }

    // Ocultar tablero momentáneamente
    const boardDiv = root.querySelector('.board');
    const tableroAmagat = Array(TABLERO_LENGTH).fill(TIPOS_CELDA.madriguera);
    boardDiv.innerHTML = renderTableroString(tableroAmagat, {});

    // Esperar 300ms antes de actualizar el tablero
    setTimeout(() => {
      if (seHaAcabatElTemps(currentState)) {
        alert(`La puntuació final de ${JUGADOR_ACTUAL} és ${currentState.puntuacio}.`);
        renderInici(root);
        return;
      }

      // Generar nuevas posiciones de los topos
      currentState.topo = generarPosicionsTopo();
      root.innerHTML = htmlbotoGuardar() + buildHTML(currentState);
    }, 300);
  };
}
