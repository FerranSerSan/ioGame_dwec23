export {registrarUsuario}
export {loginUsuari}
import {renderHeaderLogin} from "../components/header";


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

async function loginUsuari(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('https://vcajpcufcncylxiieboj.supabase.co/auth/v1/token?grant_type=password', {
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
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("id", data.user.id);
        localStorage.setItem("email",data.user.email);
        
        alert('login fet amb èxit!');

        const headerDiv = document.querySelector('#header');
        headerDiv.innerHTML = renderHeaderLogin();

        window.location.hash = '#game';
    } else {
        alert('Error en el login: ' + data.msg);
        window.location.hash = '#login';

        renderLogin();
    }
}