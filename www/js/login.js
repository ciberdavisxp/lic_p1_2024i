function validateLogin() {
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;

            if (username === 'David' && password === '1234') {
                swal("Bienvenido " + username, "Cargando procedimientos", "success");
                //alert("Bienvenido!");
                setTimeout(() => {
                    window.location.href = 'atm.html';
                },2000);
                return false;
            } else {
                swal("Error!", "No es posible validar las credenciales ingresadas", "error");
                //alert('Usuario o contraseña incorrectos. Intente de nuevo.');
                return false;
            }
        }


        