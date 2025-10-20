export { renderRegister };

function renderRegister() {
  return `
  <style>
    .register-container {
        padding-top: 50px;
        padding-right: 100px;
        padding-left: 100px;
    }
    </style>
    <div class="register-container">
        <h2>Registre d'Usuari</h2>  
        <form id="register-form" onsubmit="registrarUsuario(event)">
            <div class="mb-3">
                <label for="email" class="form-label">Correu Electrònic</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Contrasenya</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Registrar-se</button>
        </form>
    </div>
  `;
}

async function registrarUsuario(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('https://vcajpcufcncylxiieboj.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYWpwY3VmY25jeWx4aWllYm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTczNTcsImV4cCI6MjA3NjA5MzM1N30.rd5_PlobHdbIE-F4Zi3kVVIFmiHSUBWGAq5a0zTHB_E'
            },
        body: JSON.stringify({ email: email, password: password })
    });
    
    const data = await response.json();
    
    console.log(data);
    

    if (response.ok) {
        alert('Usuari registrat amb èxit!');
        window.location.hash = '#login';
    } else {
        alert('Error en el registre: ' + data.error.message);

    }
    
    
}

if (typeof window !== 'undefined') {
    window.registrarUsuario = registrarUsuario;
}