export { renderRegister };

import {registrarUsuario} from "../service/supabaseService";

function renderRegister() {
    const divFormRegister = document.createElement('div');
    divFormRegister.id = 'register-container';
    divFormRegister.style = `
        padding-top: 50px;
        padding-right: 100px;
        padding-left: 100px;
    `;
    divFormRegister.innerHTML = `
        <h2>Registre d'Usuari</h2>  
        <form id="register-form">
            <div class="mb-3">
                <label for="email" class="form-label">Correu Electrònic</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Contrasenya</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <button id="btnRegister" type="submit" class="btn btn-primary">Registrar-se</button>
        </form>
    `;

    divFormRegister.addEventListener("submit", async (e)=>{
        await registrarUsuario(e);
        divFormRegister.reset();
    })

    return divFormRegister;
}