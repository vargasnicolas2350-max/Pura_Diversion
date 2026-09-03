const celdas = document.querySelectorAll('.celda');
const textoTurno = document.getElementById('turno');
const btnReiniciar = document.getElementById('btn-reiniciar');

let jugadorActual = '❌';
let estadoJuego = ['', '', '', '', '', '', '', '', ''];
let juegoActivo = true;

// Combinaciones ganadoras (filas, columnas y diagonales)
const combinacionesGanadoras = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
  [0, 4, 8], [2, 4, 6]             // Diagonales
];

function manejarClicCelda(e) {
  const celda = e.target;
  const indice = celda.getAttribute('data-index');

  if (estadoJuego[indice] !== '' || !juegoActivo) return;

  actualizarCelda(celda, indice);
  verificarResultado();
}

function actualizarCelda(celda, indice) {
  estadoJuego[indice] = jugadorActual;
  celda.textContent = jugadorActual;
  celda.classList.add(jugadorActual === '❌' ? 'x' : 'o');
}

function cambiarTurno() {
  jugadorActual = jugadorActual === '❌' ? '⭕' : '❌';
  textoTurno.innerHTML = `Turno de: <span>${jugadorActual}</span>`;
}

function verificarResultado() {
  let haGanado = false;

  for (let i = 0; i < combinacionesGanadoras.length; i++) {
    const [a, b, c] = combinacionesGanadoras[i];
    if (estadoJuego[a] && estadoJuego[a] === estadoJuego[b] && estadoJuego[a] === estadoJuego[c]) {
      haGanado = true;
      break;
    }
  }

  if (haGanado) {
    textoTurno.innerHTML = `🎉 ¡El jugador <span>${jugadorActual}</span> ha ganado!`;
    juegoActivo = false;
    return;
  }

  if (!estadoJuego.includes('')) {
    textoTurno.innerHTML = '🤝 ¡Empate!';
    juegoActivo = false;
    return;
  }

  cambiarTurno();
}

function reiniciarJuego() {
  jugadorActual = '❌';
  estadoJuego = ['', '', '', '', '', '', '', '', ''];
  juegoActivo = true;
  textoTurno.innerHTML = `Turno de: <span>❌</span>`;

  celdas.forEach(celda => {
    celda.textContent = '';
    celda.classList.remove('x', 'o');
  });
}

celdas.forEach(celda => celda.addEventListener('click', manejarClicCelda));
btnReiniciar.addEventListener('click', reiniciarJuego);