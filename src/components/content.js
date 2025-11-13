export { renderContent };

const TABLERO_LENGTH = 91;
const PUNTUACIO_PER_A_GUANYAR = 5;
const TIPOS_CELDA = {
  madriguera: 0,
  topoAzul: 1,
  topoRojo: 2
}

function defaultState() {
  return {
    puntuacio: { blau: 0, roig: 0 },
    jugador_actual: 'blau',
    jugador_contrari: 'roig',
    puntuacio_per_a_guanyar: PUNTUACIO_PER_A_GUANYAR,
    tablero: Array(TABLERO_LENGTH).fill(TIPOS_CELDA.madriguera),
    topo: generarPosicionsTopo(TABLERO_LENGTH)
  };
}

function generarPosicionsTopo(tableroLength) {
  const blau = Math.floor(Math.random() * tableroLength);
  let roig;
  do {
    roig = Math.floor(Math.random() * tableroLength); 
  } while (roig === blau);
  return { blau, roig };
}

function actualizarPuntuacio(state, jugador, delta) {
  const valorActualizat = Math.max(0, state.puntuacio[jugador] + delta);
  return {
    ...state,
    puntuacio: {
      ...state.puntuacio,
      [jugador]: valorActualizat
    }
  };
}

function haGuanyat(state) {
  return state.puntuacio[state.jugador_actual] >= state.puntuacio_per_a_guanyar;
}

function renderTablero (tableroActual, posicionTopoAzul, posicionTopoRojo) {
  let tableroCopia = [...tableroActual];
  tableroCopia.fill(TIPOS_CELDA.madriguera);
  tableroCopia[posicionTopoAzul] = TIPOS_CELDA.topoAzul;
  tableroCopia[posicionTopoRojo] = TIPOS_CELDA.topoRojo;
  return tableroCopia;
}


function renderTableroString(tableroActual, topoBlau, topoRoig) {  
  tableroActual = renderTablero(tableroActual, topoBlau, topoRoig);
  
  return tableroActual.map((posicion, i) => {
    if (posicion === TIPOS_CELDA.topoAzul) {
      return `<div class="board-cell topoAzul" id="div${i}">
                <button class="topo-button" id="${i}"></button>
              </div>`;
    } else if (posicion === TIPOS_CELDA.topoRojo) {
      return `<div class="board-cell topoRojo" id="div${i}">
                <button class="topo-button" id="${i}"></button>
              </div>`;
    } else if (posicion === TIPOS_CELDA.madriguera) {
      return `<div class="board-cell madriguera" id="div${i}">
                <button class="topo-button" id="${i}"></button>
              </div>`;
    }
  }).join('');
}

function buildHTML(state) {
  
  return `
    <div class="puntuacio">
      <div class="punt-blau">
        <span class="color-blau">Topo Blau:</span>
        <span class="punts-blau">${state.puntuacio.blau}</span>
      </div>
      <div class="punt-roig">
        <span class="color-roig">Topo Roig:</span>
        <span class="punts-roig">${state.puntuacio.roig}</span>
      </div>
    </div>

    <div class="container">
      <div class="board-wrapper">
        <div class="game-area">
          <div class="board">
            ${renderTableroString(state.tablero, state.topo.blau, state.topo.roig)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderContent(initialState) {
  let currentState = initialState ? { ...initialState } : defaultState();
  const root = document.createElement('div');
  root.className = 'topo-game-root';
  root.innerHTML = buildHTML(currentState);

  root.addEventListener('click', (ev) => {
  ev.preventDefault();

  const boton = ev.target.closest('.topo-button');
  if (!boton) return;
  const id = parseInt(boton.id);

  if (id === currentState.topo.blau) {
    currentState = actualizarPuntuacio(currentState, currentState.jugador_actual, +1); 
  } else {
    currentState = actualizarPuntuacio(currentState, currentState.jugador_actual, -1);
  }

  if (haGuanyat(currentState)) { 
    root.innerHTML = buildHTML(currentState);

    setTimeout(() => {
      alert(`El jugador ${currentState.jugador_actual} ha guanyat!`);
      currentState = defaultState();
      root.innerHTML = buildHTML(currentState);
    }, 300);
    
    return;
  }

  currentState.topo = generarPosicionsTopo(TABLERO_LENGTH);
  root.innerHTML = buildHTML(currentState);
});
  return root;
}
