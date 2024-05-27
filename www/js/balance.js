// Archivo: balance.js

// Inicializar variables
let balance = 500;
let fechaarray = [new Date(1716604880520).toLocaleString()];
let transaccionarray = [500];

window.onload = function() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
        document.getElementById('user-name').innerText = user.name;
        document.getElementById('account-number').innerText = user.account;
        balance = user.balance; // Asegurarse de que el balance se actualice con el del usuario logueado
        fechaarray = user.transacciones.map(trans => trans.fecha); // Extraer fechas de las transacciones
        transaccionarray = user.transacciones.map(trans => trans.monto); // Extraer montos de las transacciones
        actualizarUI(); // Actualizar la UI con el balance correcto
        inicializarGrafico();
    } else {
        alert('No ha iniciado sesión');
        window.location.href = 'index.html';  // Redirigir al inicio de sesión si no hay usuario logueado
    }
};

const constraintsRetiroDeposito = {
    cantidad: {
        presence: {
            message: "La cantidad es obligatoria"
        },
        numericality: {
            greaterThan: 0,
            message: "La cantidad debe ser un número mayor que cero"
        }
    }
};

const constraintsPago = {
    cantidad: {
        presence: {
            message: "La cantidad es obligatoria"
        },
        numericality: {
            greaterThan: 0,
            message: "La cantidad debe ser un número mayor que cero"
        }
    },
    npe: {
        presence: {
            message: "El NPE es obligatorio"
        },
        length: {
            is: 8,
            message: "El NPE debe tener exactamente 8 dígitos"
        },
        numericality: {
            onlyInteger: true,
            message: "El NPE debe ser un número entero"
        }
    }
};

function mostrarErrores(errors) {
    const mensajes = [];
    for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
            mensajes.push(errors[key].join('. '));
        }
    }
    return mensajes.join('. ');
}

function actualizarUI() {
    const balanceElement1 = document.getElementById('balance');
    const balanceElement2 = document.getElementById('balance2');

    if (balanceElement1 && balanceElement2) {
        balanceElement1.textContent = balance;
        balanceElement2.textContent = balance;
    } else {
        console.error('Elementos de balance no encontrados en el DOM');
    }

    actualizarGrafico();

    // Actualizar el balance del usuario en LocalStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    loggedInUser.balance = balance;
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    
    // Actualizar la lista de usuarios en LocalStorage
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(user => user.pin === loggedInUser.pin);
    if (userIndex !== -1) {
        users[userIndex].balance = balance;
        users[userIndex].transacciones = loggedInUser.transacciones; // Asegurar que las transacciones se actualicen también
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function realizarRetiro() {
    const inputRetiro = document.getElementById('iretiro');
    const montoRetiro = parseFloat(inputRetiro.value);
    const errors = validate({ cantidad: montoRetiro }, constraintsRetiroDeposito);

    if (errors) {
        swal("Error", mostrarErrores(errors), "error");
        inputRetiro.value = '';
        return;
    }

    if (montoRetiro <= balance) {
        balance -= montoRetiro;
        transaccionarray.push(-montoRetiro);
        registrarTransaccion(montoRetiro, 'r');
        const fechaHoy = Date.now();
        const fechaLegible = new Date(fechaHoy).toLocaleString();
        fechaarray.push(fechaLegible);
        actualizarUI();
        swal("Retiro exitoso!", "$" + montoRetiro + " retirados de tu cuenta. Fecha y hora: " + fechaLegible, "success");
        if (document.getElementById('imprimirretiro').checked) {
            printRetiro(montoRetiro);
        }

        // Guardar la transacción en LocalStorage
        guardarTransaccion('retiro', montoRetiro, fechaLegible);
    } else {
        swal("Error", "Saldo insuficiente.", "error");
    }
    inputRetiro.value = '';
}

function realizarDeposito() {
    const inputDeposito = document.getElementById('ideposito');
    const montoDeposito = parseFloat(inputDeposito.value);
    const errors = validate({ cantidad: montoDeposito }, constraintsRetiroDeposito);

    if (errors) {
        swal("Error", mostrarErrores(errors), "error");
        inputDeposito.value = '';
        return;
    }

    balance += montoDeposito;
    transaccionarray.push(montoDeposito);
    registrarTransaccion(montoDeposito, 'd');
    const fechaHoy = Date.now();
    const fechaLegible = new Date(fechaHoy).toLocaleString();
    fechaarray.push(fechaLegible);
    actualizarUI();
    swal("Depósito exitoso!", "$" + montoDeposito + " abonados a tu cuenta. Fecha y hora: " + fechaLegible, "success");
    if (document.getElementById('imprimirdeposito').checked) {
        printDeposito(montoDeposito);
    }

    // Guardar la transacción en LocalStorage
    guardarTransaccion('deposito', montoDeposito, fechaLegible);
    inputDeposito.value = '';
}

function realizarPago() {
    const inputNPE = document.getElementById('inpe');
    const inputPagar = document.getElementById('ipagar');
    const montoPagar = parseFloat(inputPagar.value);
    const servpagar = document.getElementById('spagar').value;
    const npe = inputNPE.value.trim();
    const errors = validate({ cantidad: montoPagar, npe: npe }, constraintsPago);

    if (errors) {
        swal("Error", mostrarErrores(errors), "error");
        inputNPE.value = '';
        inputPagar.value = '';
        return;
    }

    if (montoPagar <= balance) {
        balance -= montoPagar;
        transaccionarray.push(-montoPagar);
        registrarTransaccionPago(montoPagar, npe);
        const fechaHoy = Date.now();
        const fechaLegible = new Date(fechaHoy).toLocaleString();
        fechaarray.push(fechaLegible);
        actualizarUI();
        swal("Pago de servicio exitoso!", "Factura de " + servpagar + " por $" + montoPagar + ". Fecha y hora: " + fechaLegible, "success");
        if (document.getElementById('imprimirpago').checked) {
            printPago(montoPagar);
        }

        // Guardar la transacción en LocalStorage
        guardarTransaccion('pago', montoPagar, fechaLegible, npe, servpagar);
    } else {
        swal("Error", "Saldo insuficiente.", "error");
    }
    inputNPE.value = '';
    inputPagar.value = '';
}

function registrarTransaccion(monto, tipo) {
    const contenedorTransacciones1 = document.getElementById('transacciones1');
    const contenedorTransacciones2 = document.getElementById('transacciones2');
    const timestamp = new Date();
    const nombreTransaccion = `tx-${tipo}-${timestamp.getTime()}`;
    const mensaje = tipo === 'r' ? `-$${monto}` : `+$${monto}`;
    contenedorTransacciones1.innerHTML += `${mensaje}: ${nombreTransaccion} <br>`;
    contenedorTransacciones2.innerHTML += `${mensaje}: ${nombreTransaccion} <br>`;
}

function registrarTransaccionPago(monto, npe) {
    const contenedorTransacciones1 = document.getElementById('transacciones1');
    const contenedorTransacciones2 = document.getElementById('transacciones2');
    const timestamp = new Date();
    const nombreTransaccion = `p-${npe}-${timestamp.getTime()}`;
    contenedorTransacciones1.innerHTML += `-$${monto}: ${nombreTransaccion}<br>`;
    contenedorTransacciones2.innerHTML += `-$${monto}: ${nombreTransaccion}<br>`;
}

document.querySelector('.consulta2').addEventListener('click', function() {
    var tx1 = document.getElementById('tx1');
    var tx2 = document.getElementById('tx2');
    var boton = document.querySelector('.consulta2');

    if (tx1.style.display === 'none') {
        tx1.style.display = 'block';
        tx2.style.display = 'none';
        boton.innerHTML = "Gráfico &#8656;";
    } else {
        tx1.style.display = 'none';
        tx2.style.display = 'block';
        boton.innerHTML = "&#8656; Transacciones";
    }
});

function obtenercuenta() {
    return document.getElementById('cuenta').innerText;
}

function obtenertransacciones() {
    return document.getElementById('tx1').innerText; 
}

function consultageneral() {
    const textcuenta = obtenercuenta();
    const texttransacciones = obtenertransacciones();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text(textcuenta, 10, 10);
    doc.text(Date(), 10, 20);
    doc.text(texttransacciones, 10, 50);
    const timestamp = new Date().getTime();
    doc.save("transacciones_"+timestamp+".pdf");
}

function printRetiro(amount) {
    const textcuenta = obtenercuenta();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("PokemonBank", 10, 10);
    doc.setFontSize(12);
    doc.text(textcuenta, 10, 20);
    doc.text(Date(), 10, 30);
    doc.text("Recibo de Retiro", 10, 60);
    doc.text("Monto retirado: $" + amount.toFixed(2), 10, 70);

    const timestamp = new Date().getTime();
    doc.save("Recibo_Retiro_" + timestamp + ".pdf");
}

function printDeposito(amount) {
    const textcuenta = obtenercuenta();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("PokemonBank", 10, 10);
    doc.setFontSize(12);
    doc.text(textcuenta, 10, 20);
    doc.text(Date(), 10, 30);
    doc.text("Recibo de Depósito", 10, 60);
    doc.text("Monto depositado: $" + amount.toFixed(2), 10, 70);

    const timestamp = new Date().getTime();
    doc.save("Recibo_Deposito_" + timestamp + ".pdf");
}

function printPago(amount) {
    const textcuenta = obtenercuenta();
    const npe = document.getElementById('inpe').value; 
    const servicio = document.getElementById('spagar').value;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("PokemonBank", 10, 10);
    doc.setFontSize(12);
    doc.text(textcuenta, 10, 20);
    doc.text(Date(), 10, 30);
    doc.text("Recibo de Pago de servicio", 10, 60);
    doc.text("Número NPE: " + npe, 10, 70); 
    doc.text("Servicio: " + servicio, 10, 80); 
    doc.text("Pago por: $" + amount.toFixed(2), 10, 90);
    const timestamp = new Date().getTime();
    doc.save("Recibo_Pago_" + timestamp + ".pdf");
}

function guardarTransaccion(tipo, monto, fecha, npe = null, servicio = null) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser.transacciones) {
        loggedInUser.transacciones = [];
    }

    const transaccion = {
        tipo: tipo,
        monto: monto,
        fecha: fecha,
        npe: npe,
        servicio: servicio
    };

    loggedInUser.transacciones.push(transaccion);
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

    // Actualizar la lista de usuarios en LocalStorage
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(user => user.pin === loggedInUser.pin);
    if (userIndex !== -1) {
        users[userIndex] = loggedInUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Esperar a que el DOM esté completamente cargado antes de ejecutar actualizarUI
document.addEventListener('DOMContentLoaded', function() {
    actualizarUI();
});



let transactionsChart;

function inicializarGrafico() {
    const ctx = document.getElementById('transactionsChart').getContext('2d');
    if (transactionsChart) {
        transactionsChart.destroy(); // Destruir el gráfico anterior
    }
    transactionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fechaarray,
            datasets: [{
                label: 'Monto ($)',
                data: transaccionarray,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

function actualizarGrafico() {
    if (transactionsChart) {
        transactionsChart.data.labels = fechaarray;
        transactionsChart.data.datasets[0].data = transaccionarray;
        transactionsChart.update();
    } else {
        inicializarGrafico();
    }
}

