export {renderContent}

function renderContent(){
    const tablero = Array(25).fill(0).map((_,i) => 1)
    return `
    <div class="container boalrd-Wrapper">
      <div class="board">
        ${tablero.map((_,i) => `<div class="board-cell" id="cell-${i}"></div>`).join('')}
      </div>
    </div>
    `;

}