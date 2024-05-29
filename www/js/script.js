// Archivo: script.js

// Inicializar datos de usuarios
function initializeUsers() {
    const users = [
        { name: 'Alberto', pin: '2468', account: '2244668800', balance: 500.00, transacciones: [{"tipo":"deposito","monto":500,"fecha":"27/5/2024, 12:49:07 a. m.","npe":null,"servicio":null}] },
        { name: 'David', pin: '4321', account: '1234567890', balance: 500.00, transacciones: [{"tipo":"deposito","monto":500,"fecha":"27/5/2024, 12:49:07 a. m.","npe":null,"servicio":null}] },
        { name: 'Ash', pin: '1234', account: '0987654321', balance: 500.00, transacciones: [{"tipo":"deposito","monto":500,"fecha":"27/5/2024, 12:49:07 a. m.","npe":null,"servicio":null}] }
    ];
    localStorage.setItem('users', JSON.stringify(users));
}

// Llamar a la función de inicialización al cargar la página
window.onload = function() {
    if (!localStorage.getItem('users')) {
        initializeUsers();
    }
};

// Manejar inicio de sesión
function login() {
    const username = document.getElementById('username').value.trim();
    const pin = document.getElementById('pin').value.trim();
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.name === username && user.pin === pin);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'atm.html';  // Redirigir a la página principal del usuario
    } else {
        swal('Error de ingreso!','Nombre de usuario o PIN incorrecto','error');
    }
}

// Mostrar imagen en la interfaz de usuario
function showImage(type) {
    var imagePath = '';
    switch (type) {
        case 'retiro':
            imagePath = 'img/retiro.png';
            break;
        case 'deposito':
            imagePath = 'img/deposito.png';
            break;
        case 'consulta':
            imagePath = 'img/consulta.png';
            break;
        case 'pagos':
            imagePath = 'img/pagos.png';
            break;
    }
    var imgElement = document.getElementById('infoImage');
    imgElement.src = imagePath;
    imgElement.classList.add('show');
}

// Configurar imagen predeterminada
function setDefaultImage() {
    var imgElement = document.getElementById('infoImage');
    imgElement.src = 'img/movimientos.png';
    imgElement.classList.add('show');
}

// Mostrar y ocultar divisiones de acciones
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.atm-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('onmouseover').match(/'([^']+)'/)[1]; // Extrae la acción del atributo onmouseover
            showActionDiv(action);
        });
    });
});

function showActionDiv(action) {
    const actionDivs = document.querySelectorAll('.action-label.action-h');
    actionDivs.forEach(div => {
        if (div.id === action) {
            div.style.display = 'block'; // Muestra la div correspondiente
        } else {
            div.style.display = 'none'; // Oculta las demás divs
        }
    });
}

function toggleDivVisibility(buttonElement, divToShowId) {
    // Ocultar la div del botón
    buttonElement.closest('div').style.display = 'none';

    // Mostrar la div específica por ID
    const divToShow = document.getElementById(divToShowId);
    divToShow.style.display = 'block';
}
