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

        function setDefaultImage() {
            var imgElement = document.getElementById('infoImage');
            imgElement.src = 'img/movimientos.png';
            imgElement.classList.add('show');
        }


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



