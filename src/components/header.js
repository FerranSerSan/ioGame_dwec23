export {renderHeader}
export {renderHeaderLogin}

function renderHeader(){
    return `
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#game">Game name</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#game">Game</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#login">Login</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#register">Register</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
    `;
}

function renderHeaderLogin(){
    return `
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#game">Game name</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#game">Game</a>
        </li>
      </ul>
<ul class="navbar-nav ms-auto">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span>${localStorage.getItem('email')}</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li><a class="dropdown-item" href="#">Preferenes</a></li>
            <li><a class="dropdown-item" href="#login" onclick="logout()">Logout</a></li>
      
          </ul>
        </li>
</ul>
    </div>
  </div>
</nav>
    `;
}

async function logout() {

  const response = await fetch('https://vcajpcufcncylxiieboj.supabase.co/auth/v1/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYWpwY3VmY25jeWx4aWllYm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTczNTcsImV4cCI6MjA3NjA5MzM1N30.rd5_PlobHdbIE-F4Zi3kVVIFmiHSUBWGAq5a0zTHB_E',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')  
          },
    });
    
    const data = await response.json();

     if (response.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        alert('Sessió tancada amb èxit!');
        
        const headerDiv = document.querySelector('#header');
        headerDiv.innerHTML = renderHeader();
    } else {
        alert('Error en el logout ' + data.error.message);
    }
}

if (typeof window !== 'undefined') {
    window.logout = logout;
}