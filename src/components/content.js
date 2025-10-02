export {renderContent}

function renderContent(){
    const content = document.createElement('div')
    content.classList.add('content')
    content.textContent = 'Hola Mundo'
    return content
}