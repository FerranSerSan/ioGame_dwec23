export { renderContent };

const tablero = Array(49).fill(1);

function renderContent(tableroActual = tablero) {
  const [topoBlau, topoRoig] = generarPosicionsTopo(tableroActual);

  const html = `
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
    boto.addEventListener('click', () => {
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
      return `<div class="board-cell" id="cell-${i}">
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
