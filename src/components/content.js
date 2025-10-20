export { renderContent };

const tablero = Array(91).fill(1);
var puntuacio_blau = 0;
var puntuacio_roig = 0;
const jugador_actual = 'blau';
const jugador_contrari = 'roig'; 

function renderContent(tableroActual = tablero) {
  const [topoBlau, topoRoig] = generarPosicionsTopo(tableroActual);

  const html = `
  <div class="puntuacio">
    <div class="punt-blau">
      <span class="color-blau">Topo Blau:</span>
      <span id="punts-blau">${puntuacio_blau}</span>
    </div>
    <div class="punt-roig">
      <span class="color-roig">Topo Roig:</span>
      <span id="punts-roig">${puntuacio_roig}</span>
    </div>
  </div>

  <div class="container">
    <div class="board-wrapper">
      <div class="game-area">
        <div class="board" id="board">
          ${renderTablero(tableroActual, topoBlau, topoRoig)}
        </div>
      </div>
    </div>
  </div>
  `;

  // Quan el HTML s'ha inserit al DOM
  setTimeout(() => {
    afegirListeners(tableroActual);
  }, 0);

  return html;
}

function afegirListeners(tableroActual) {
  document.querySelectorAll('.topo-button').forEach(boto => {
    boto.addEventListener('click', async () => {

      // si el jugador ha encertat el topo del seu color
      if (boto.getAttribute('tipo') === jugador_actual) {
        if (jugador_actual === 'blau') {
          puntuacio_blau += 1;
          document.getElementById('punts-blau').textContent = puntuacio_blau;
        } else if (jugador_actual === 'roig') {
          puntuacio_roig += 1;
          document.getElementById('punts-roig').textContent = puntuacio_roig;
        }
        // await cuentaAtras();
      }

      // si el jugador ha fallat
      if (boto.getAttribute('tipo') == jugador_contrari || boto.getAttribute('tipo') === 'normal') {
        if (jugador_actual === 'blau' && puntuacio_blau > 0) {
          puntuacio_blau -= 1;
          document.getElementById('punts-blau').textContent = puntuacio_blau;
        } else if (jugador_actual === 'roig' && puntuacio_roig > 0) {
          puntuacio_roig -= 1;
          document.getElementById('punts-roig').textContent = puntuacio_roig;
        }
        // await cuentaAtras();
      }

      const [nouBlau, nouRoig] = generarPosicionsTopo(tableroActual);
      document.getElementById('board').innerHTML =
        renderTablero(tableroActual, nouBlau, nouRoig);

      // Torna a posar els listeners després del canvi
      afegirListeners(tableroActual);
    });
  });
}

function renderTablero(tableroActual, topoBlau, topoRoig) {
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

function generarPosicionsTopo(tableroActual = tablero) {
  const topoBlau = Math.floor(Math.random() * tableroActual.length);
  let topoRoig;
  do {
    topoRoig = Math.floor(Math.random() * tableroActual.length);
  } while (topoRoig === topoBlau);
  return [topoBlau, topoRoig];
}

function cuentaAtras() {
  
} 