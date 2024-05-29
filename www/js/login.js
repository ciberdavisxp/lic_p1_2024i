function validateLogin() {
    // Obtener valores de los campos de entrada
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Validar credenciales
    if (username === 'David' && password === '1234') {
        // Mostrar mensaje de bienvenida
        swal("Bienvenido " + username, "Cargando procedimientos", "success");
        
        // Redirigir a la página principal después de 2 segundos
        setTimeout(() => {
            window.location.href = 'atm.html';
        }, 2000);
        return false;
    } else {
        // Mostrar mensaje de error
        swal("Error!", "No es posible validar las credenciales ingresadas", "error");
        return false;
    }
}
