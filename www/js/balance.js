let balance = 60; 

function actualizarUI() {
    document.getElementById('balance').textContent = balance;
    document.getElementById('balance2').textContent = balance;
}




function realizarRetiro() {
    const inputRetiro = document.getElementById('iretiro');
    const montoRetiro = parseFloat(inputRetiro.value);
    if (montoRetiro > 0 && montoRetiro <= balance) {
        balance -= montoRetiro;
        registrarTransaccion(montoRetiro, 'r');
        actualizarUI();
        swal("Retiro exitoso!","$" + montoRetiro + " retirados de tu cuenta.", "success");
        if (document.getElementById('imprimirretiro').checked) {
            printRetiro(montoRetiro);  
        }
    } else {
        swal("Error","Monto de retiro inválido o saldo insuficiente.","error");
        
    }
    inputRetiro.value = ''; 
}




function realizarDeposito() {
    const inputDeposito = document.getElementById('ideposito');
    const montoDeposito = parseFloat(inputDeposito.value);
    if (montoDeposito > 0) {
        balance += montoDeposito;
        registrarTransaccion(montoDeposito, 'd');
        actualizarUI();
        swal("Deposito","Fueron abonados $" + montoDeposito + " a tu cuenta.", "success");
        if (document.getElementById('imprimirdeposito').checked) {
            printDeposito(montoDeposito);  
        }
    } else {
        swal("Error","Ingrese un monto válido para depositar.","error");
        
    }
    inputDeposito.value = ''; 
}




function realizarPago() {
    const inputNPE = document.getElementById('inpe');
    const inputPagar = document.getElementById('ipagar');
    const montoPagar = parseFloat(inputPagar.value);
    const servpagar = document.getElementById('spagar').value;
    const npe = inputNPE.value.trim();
    if (!isNaN(montoPagar) && montoPagar > 0 && montoPagar <= balance) {
        balance -= montoPagar;  
        registrarTransaccionPago(montoPagar, npe);  
        actualizarUI();  
        swal("Pago de servicio exitoso!", "Factura de " + servpagar + " por $" + montoPagar + ".", "success");
        if (document.getElementById('imprimirpago').checked) {
            printPago(montoPagar);  
        }
    } else {
        swal("Error","Monto de pago inválido o saldo insuficiente.","error");
        
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
    doc.text("Recibo de Pago de servivio", 10, 60);
    doc.text("Número NPE: " + npe, 10, 70); 
    doc.text("Servicio: " + servicio, 10, 80); 
    doc.text("Pago por: $" + amount.toFixed(2), 10, 90);
    const timestamp = new Date().getTime();
    doc.save("Recibo_Pago_" + timestamp + ".pdf");
}


actualizarUI(); 



