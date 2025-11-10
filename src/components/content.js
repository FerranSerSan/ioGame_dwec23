export { renderContent };

/* Constants per a declarar els datos com la longitud del tablero o la puntuacio per a guanyar*/
const TABLERO_LENGTH = 91;
const PUNTUACIO_PER_A_GUANYAR = 5;
const TIPOS_CELDA = {
  0: "madriguera",
  1: "topoAzul",
  2: "topoRojo"
}

function defaultState() {
  return {
    puntuacio: { blau: 0, roig: 0 },
    jugador_actual: 'blau',
    jugador_contrari: 'roig',
    puntuacio_per_a_guanyar: PUNTUACIO_PER_A_GUANYAR,
    tablero: Array(TABLERO_LENGTH).fill(0),
    topo: generarPosicionsTopo(TABLERO_LENGTH)
  };
}

/* ---------- Funcions pures / helpers ---------- */

function generarPosicionsTopo(tableroLength) {
  const blau = Math.floor(Math.random() * tableroLength);
  let roig;
  do {
    roig = Math.floor(Math.random() * tableroLength); 
  } while (roig === blau);
  return { blau, roig };
}

function actualizarPuntuacio(state, jugador, delta) {
  // retorna nou objecte state amb la puntuació actualitzada
  // si la operacio es menor que 0, retorna 0
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

function renderTableroString(tableroActual, topoBlau, topoRoig) {
  return tableroActual.map((_, i) => {
    if (i === topoBlau) {
      return `<div class="board-cell topoAzul" id="cell-${i}">
                <button class="topo-button" tipo="blau"></button>
              </div>`;
    } else if (i === topoRoig) {
      return `<div class="board-cell topoRojo" id="cell-${i}">
                <button class="topo-button" tipo="roig"></button>
              </div>`;
    } else {
      return `<div class="board-cell madriguera" id="cell-${i}">
                <button class="topo-button" tipo="normal"></button>
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

/*
  renderContent: crea un root DOM node, hi enganxa el HTML basat en
  l'estat inicial, i registra UN únic listener (delegació).
  Retorna el node perquè l'aplicació que l'importa l'afegeixi al document.
*/
function renderContent(initialState) {
  let currentState = initialState ? { ...initialState } : defaultState();

  const root = document.createElement('div');
  root.className = 'topo-game-root';
  root.innerHTML = buildHTML(currentState);

  // Event delegation: un únic listener al root
  root.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.topo-button');
    if (!btn || !root.contains(btn)) return;

    const tipo = btn.getAttribute('tipo');

    // Decideixo el jugador afectat: en la teva lògica sembla que només
    // modifiques "blau" segons si el clic és de jugador_actual o no.
    // Si vols que també modifiqui "roig" quan jugador_actual='roig', canvia la lògica.
    if (tipo === currentState.jugador_actual) {
      currentState = actualizarPuntuacio(currentState, currentState.jugador_actual, +1);
    } else if (tipo === currentState.jugador_contrari || tipo == "normal") {
      currentState = actualizarPuntuacio(currentState, currentState.jugador_actual, -1);
    }

    // Comprovem si s'ha guanyat: en cas afirmatiu, fem reset de puntuacions
    if (haGuanyat(currentState)) {
      // EFECTE: alert (confinat aquí)
      alert(`El jugador ${currentState.jugador_actual} ha guanyat!`);
      currentState = {
        ...currentState,
        puntuacio: { blau: 0, roig: 0 }
      };
    }

    // Generem nous topos (purs)
    currentState = {
      ...currentState,
      topo: generarPosicionsTopo(currentState.tablero.length)
    };

    // Re-render parcial: actualitzem marcador i tauler dins del root
    const puntsBlauNode = root.querySelector('.punts-blau');
    const puntsRoigNode = root.querySelector('.punts-roig');
    const boardNode = root.querySelector('.board');

    if (puntsBlauNode) puntsBlauNode.textContent = String(currentState.puntuacio.blau);
    if (puntsRoigNode) puntsRoigNode.textContent = String(currentState.puntuacio.roig);
    if (boardNode) boardNode.innerHTML = renderTableroString(currentState.tablero, currentState.topo.blau, currentState.topo.roig);
  });

  return root;
}
