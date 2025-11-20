export { renderContent };

const TABLERO_LENGTH = 91;
const PUNTUACIO_PER_A_GUANYAR = 3;
const JUGADOR_ACTUAL = "Ferran";
const JUGADOR_CONTRARI = "x";
const TIPOS_CELDA = {
  madriguera: 0,
  topoAzul: 1,
  topoRojo: 2,
  topoVerde: 3
};

// Estado por defecto
function defaultState() {
  return {
    puntuacio: { [JUGADOR_ACTUAL]: 0, [JUGADOR_CONTRARI]: 0 },
    puntuacio_per_a_guanyar: PUNTUACIO_PER_A_GUANYAR,
    tablero: Array(TABLERO_LENGTH).fill(TIPOS_CELDA.madriguera),
    colorTopoActual: colorAleatori(),
    topo: generarPosicionsTopo()
  };
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
  const valorActualizat = Math.max(0, state.puntuacio[JUGADOR_ACTUAL] + delta);
  return {
    ...state,
    puntuacio: {
      ...state.puntuacio,
      [JUGADOR_ACTUAL]: valorActualizat
    }
  };
}

// Comprobación de victoria
function haGuanyat(state) {
  return state.puntuacio[JUGADOR_ACTUAL] >= state.puntuacio_per_a_guanyar;
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
  return `
    <div class="puntuacio">
      <div><span>${JUGADOR_ACTUAL}:</span> <span>${state.puntuacio[JUGADOR_ACTUAL]}</span></div>
      <div><span>${JUGADOR_CONTRARI}:</span> <span>${state.puntuacio[JUGADOR_CONTRARI]}</span></div>
    </div>

    <div class="color-Topo">
      <div class="${"color" + state.colorTopoActual}"></div>
    </div>

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

// Pantalla del juego
function renderJoc(root, currentState) {
  root.innerHTML = buildHTML(currentState);

  console.log(currentState.topo);

  root.onclick = (ev) => {
    const boton = ev.target.closest('.topo-button');
    if (!boton) return;
    const id = parseInt(boton.id);

    // Comprobar si se ha clicado algún topo
    let acierto = false;
    for (const color in currentState.topo) {
      if (currentState.topo[color] === id) {
        currentState = actualizarPuntuacio(currentState, +1);
        acierto = true;
        break;
      }
    }
    if (!acierto) currentState = actualizarPuntuacio(currentState, -1);

    // Ocultar tablero momentáneamente
    const boardDiv = root.querySelector('.board');
    const tableroAmagat = Array(TABLERO_LENGTH).fill(TIPOS_CELDA.madriguera);
    boardDiv.innerHTML = renderTableroString(tableroAmagat, {});

    setTimeout(() => {
      if (haGuanyat(currentState)) {
        alert(`El jugador ${JUGADOR_ACTUAL} ha guanyat!`);
        renderInici(root);
        return;
      }

      // Generar nuevas posiciones de los topos
      currentState.topo = generarPosicionsTopo();
      root.innerHTML = buildHTML(currentState);
    }, 300);
  };
}
