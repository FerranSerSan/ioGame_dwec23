export {renderLogin};

import {loginUsuari} from "../service/supabaseService";

function renderLogin(){
    const divForm = document.createElement('div');
    divForm.id = 'register-container';
    divForm.style = `
        padding-top: 50px;
        padding-right: 100px;
        padding-left: 100px;
    }`;
    
    divForm.innerHTML = `
        <h2>Login d'Usuari</h2>

        <form id="register-form">
            <div class="mb-3">
                <label for="email" class="form-label">Correu Electrònic</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Contrasenya</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <button id="btnLogin" type="submit" class="btn btn-primary">Login</button>
        </form>
  `;
    divForm.addEventListener("submit", async (e)=>{
        await loginUsuari(e);
    })

  return divForm;
}

