const display = document.getElementById('display');
let currentInput = '';
let justCalculated = false;

/* Eventos del teclado */
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key === "Enter") {
        sendToServer(currentInput); // ejecuta cálculo
    } else if (key === "Escape") {
        currentInput = "";
        display.textContent = "0";
        justCalculated = false;
    } else if ("0123456789+-*/().".includes(key)) {
        if (justCalculated && !isNaN(key)) {
            currentInput = key;
        } else {
            currentInput += key;
        }
        display.textContent = currentInput;
        justCalculated = false;
    }
});

/* evento de click en pantalla */
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;

        if (button.id === "clear"){
            currentInput = "";
            display.textContent = "0";
            justCalculated = false;
        } else if (button.id === "equals") {
            sendToServer(currentInput);
        } else {
            if (justCalculated && !isNaN(value)){
                // si acabamos de calcular y ahora viene en n°, reiniciamos
                currentInput = value;
            } else {
                currentInput += value;
            }
            display.textContent = currentInput;
            justCalculated = false;
        }

    });
});
// función de conexion Python y JavaScript 
function sendToServer(expression) { // Ruta del server que crea la peticion
    // hHace peticiones HTTP desde JS
    fetch('/calculate', {
        method: "POST",  // Metodo de envio
        headers: {
            "Content-type": "application/json" // Dice al server que tipo de archivo vamos a trabajar
        },
        // Construye la expresion
        body: JSON.stringify({ expression }) // ({"expresion": 7*6})
    })
    //Respuesta del servidor
    .then(response => response.json()) //{"result": 42}
    //Maneja el resultado
    .then(data => {
        display.textContent = data.result; //Muestra el resultado por pantalla
        currentInput = data.result.toString(); //Guarda el resultado para seguir calculando
        justCalculated = true; //Acabamos de ejecutar
    })
    .catch(err => { //captura el error y lo saca por consola
        display.textContent = "Error";
        console.error("err");
    });
}


