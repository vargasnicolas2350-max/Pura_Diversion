const TAMANO = 14; // Matriz equilibrada de 14x14 para letras grandes y legibles
let categoriaActual = '';
let palabras = [];
let palabrasEncontradas = [];
let grid = [];
let celdasSeleccionadas = [];

// Banco con más de 20 palabras por categoría
const bancoPalabras = {
  ciudades: [
    'BOGOTA', 'MEDELLIN', 'CALI', 'CARTAGENA', 'MADRID', 'BARCELONA', 'LIMA',
    'PARIS', 'TOKIO', 'LONDRES', 'ROMA', 'BERLIN', 'MIAMI', 'SANTIAGO',
    'QUITO', 'AMSTERDAM', 'TORONTO', 'MOSCU', 'ATENAS', 'DUBAI'
  ],
  carros: [
    'TOYOTA', 'FORD', 'CHEVROLET', 'NISSAN', 'BMW', 'AUDI', 'HONDA', 'MAZDA',
    'MERCEDES', 'RENAULT', 'VOLKSWAGEN', 'HYUNDAI', 'KIA', 'SUZUKI', 'FIAT', 'PORSCHE',
    'FERRARI', 'LAMBORGHINI', 'VOLVO', 'SUBARU'
  ],
  restaurantes: [
    'FRISBY', 'ELCORRAL', 'CREPES', 'SUBWAY', 'KFC', 'DOMINOS', 'MCDONALDS', 'STARBUCKS',
    'BURGERKING', 'PIZZAHUT', 'TACOBELL', 'WOK', 'PUPPIS', 'JENOSPIZZA', 'KOKORIKO',
    'DUNKIN', 'RAPPI', 'HARDROCK', 'ARCHIES', 'TAKAMI'
  ],
  computadores: [
    'LENOVO', 'APPLE', 'DELL', 'HP', 'ASUS', 'ACER', 'MSI', 'SAMSUNG',
    'TOSHIBA', 'ALIENWARE', 'COMPAQ', 'RAZER', 'CORSAIR', 'GIGABYTE', 'HUAWEI',
    'INTEL', 'AMD', 'NVIDIA', 'LOGITECH', 'MICROSOFT'
  ],
  celulares: [
    'SAMSUNG', 'XIAOMI', 'IPHONE', 'MOTOROLA', 'REALME', 'HONOR', 'NOKIA', 'HUAWEI',
    'ONEPLUS', 'OPPO', 'VIVO', 'GOOGLEPIXEL', 'SONY', 'LG', 'ALCATEL',
    'ZTE', 'BLACKBERRY', 'NOTHING', 'POCO', 'TECNO'
  ],
  paises: [
    'COLOMBIA', 'MEXICO', 'ESPAÑA', 'PERU', 'CHILE', 'BRASIL', 'ARGENTINA', 'CANADA',
    'ALEMANIA', 'FRANCIA', 'ITALIA', 'JAPON', 'CHINA', 'AUSTRALIA', 'EGIPTO',
    'URUGUAY', 'ECUADOR', 'BOLIVIA', 'PANAMA', 'SUIZA'
  ],
  objetos: [
    'SILLA', 'MESA', 'SOFA', 'CAMA', 'LAMPARA', 'ESPEJO', 'RELOJ', 'CUADRO',
    'ARMARIO', 'ESCRITORIO', 'CORTINA', 'ALFOMBRA', 'NEVERA', 'TELEVISOR', 'HORNO',
    'VENTANA', 'PUERTA', 'ESTANTE', 'COJIN', 'FLORERO'
  ],
  nombres: [
    'CARLOS', 'MARIA', 'JUAN', 'SOFIA', 'ANDRES', 'LUCIA', 'PEDRO', 'VALENTINA',
    'MATEO', 'CAMILA', 'DANIEL', 'ISABELLA', 'ALEJANDRO', 'NATALIA', 'SANTIAGO',
    'GABRIEL', 'DANIELA', 'LUCAS', 'EMMA', 'DIEGO'
  ],
  apellidos: [
    'GARCIA', 'RODRIGUEZ', 'GOMEZ', 'LOPEZ', 'GONZALEZ', 'MARTINEZ', 'PEREZ', 'SANCHEZ',
    'RAMIREZ', 'TORRES', 'DIAZ', 'VARGAS', 'CASTRO', 'MORALES', 'HERRERA',
    'JIMENEZ', 'ROJAS', 'ORTIZ', 'SILVA', 'ROMERO'
  ],
  ciencia: [
    'ATOMO', 'CELULA', 'LASER', 'ENERGIA', 'QUIMICA', 'FISICA', 'GENETICA', 'NEURONA',
    'MOLECULA', 'GRAVEDAD', 'MAGNETO', 'GENOMA', 'BACTERIA', 'VIRUS', 'ELECTRON',
    'PROTON', 'NEUTRON', 'GALAXIA', 'PLANETA', 'ORBITA'
  ]
};

function iniciarJuego(categoria) {
  categoriaActual = categoria;
  document.getElementById('pantalla-inicio').classList.add('hidden');
  document.getElementById('pantalla-tablero').classList.remove('hidden');
  generarSopa();
}

function volverInicio() {
  document.getElementById('pantalla-tablero').classList.add('hidden');
  document.getElementById('pantalla-inicio').classList.remove('hidden');
}

function reiniciarPartida() {
  generarSopa();
}

function generarSopa() {
  palabrasEncontradas = [];
  celdasSeleccionadas = [];
  grid = Array(TAMANO).fill(null).map(() => Array(TAMANO).fill(''));
  
  // Selecciona exactamente 15 palabras aleatorias
  const listaBase = [...bancoPalabras[categoriaActual]];
  palabras = listaBase.sort(() => 0.5 - Math.random()).slice(0, 15);

  const palabrasColocadas = [];
  palabras.forEach(palabra => {
    if (colocarPalabra(palabra)) {
      palabrasColocadas.push(palabra);
    }
  });
  palabras = palabrasColocadas;

  actualizarEncabezado();
  renderizarListaPalabras();

  // Rellenar vacíos con letras aleatorias
  const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  for (let r = 0; r < TAMANO; r++) {
    for (let c = 0; c < TAMANO; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letras[Math.floor(Math.random() * letras.length)];
      }
    }
  }

  renderizarGrid();
}

function colocarPalabra(palabra) {
  let colocada = false;
  let intentos = 0;

  while (!colocada && intentos < 150) {
    intentos++;
    const direccion = Math.floor(Math.random() * 3); // 0: Horiz, 1: Vert, 2: Diag
    let filaMax = TAMANO;
    let colMax = TAMANO;

    if (direccion === 0) colMax = TAMANO - palabra.length;
    else if (direccion === 1) filaMax = TAMANO - palabra.length;
    else if (direccion === 2) {
      filaMax = TAMANO - palabra.length;
      colMax = TAMANO - palabra.length;
    }

    if (filaMax < 0 || colMax < 0) continue;

    const fila = Math.floor(Math.random() * filaMax);
    const col = Math.floor(Math.random() * colMax);

    let sePuede = true;
    for (let i = 0; i < palabra.length; i++) {
      let r = fila;
      let c = col;
      if (direccion === 0) c += i;
      else if (direccion === 1) r += i;
      else if (direccion === 2) { r += i; c += i; }

      if (grid[r][c] !== '' && grid[r][c] !== palabra[i]) {
        sePuede = false;
        break;
      }
    }

    if (sePuede) {
      for (let i = 0; i < palabra.length; i++) {
        let r = fila;
        let c = col;
        if (direccion === 0) c += i;
        else if (direccion === 1) r += i;
        else if (direccion === 2) { r += i; c += i; }
        grid[r][c] = palabra[i];
      }
      colocada = true;
    }
  }
  return colocada;
}

function actualizarEncabezado() {
  const titulo = document.getElementById('titulo-categoria');
  titulo.textContent = `${categoriaActual.toUpperCase()} (${palabrasEncontradas.length}/${palabras.length})`;
}

function renderizarListaPalabras() {
  const contenedor = document.getElementById('lista-palabras');
  contenedor.innerHTML = '';
  palabras.forEach(p => {
    const tag = document.createElement('span');
    tag.className = 'palabra-tag';
    tag.id = `tag-${p}`;
    tag.textContent = p;
    contenedor.appendChild(tag);
  });
}

function renderizarGrid() {
  const contenedor = document.getElementById('sopa-grid');
  contenedor.innerHTML = '';

  for (let r = 0; r < TAMANO; r++) {
    for (let c = 0; c < TAMANO; c++) {
      const celda = document.createElement('button');
      celda.className = 'letra-celda';
      celda.textContent = grid[r][c];
      celda.dataset.fila = r;
      celda.dataset.col = c;

      celda.addEventListener('click', () => tocarCelda(celda));

      contenedor.appendChild(celda);
    }
  }
}

function tocarCelda(celda) {
  if (celda.classList.contains('encontrada')) return;

  if (celda.classList.contains('seleccionada')) {
    celda.classList.remove('seleccionada');
    celdasSeleccionadas = celdasSeleccionadas.filter(c => c !== celda);
  } else {
    celda.classList.add('seleccionada');
    celdasSeleccionadas.push(celda);
  }

  comprobarPalabra();
}

function comprobarPalabra() {
  const textoFormado = celdasSeleccionadas.map(c => c.textContent).join('');
  const textoInvertido = textoFormado.split('').reverse().join('');

  let encontrada = null;
  if (palabras.includes(textoFormado) && !palabrasEncontradas.includes(textoFormado)) {
    encontrada = textoFormado;
  } else if (palabras.includes(textoInvertido) && !palabrasEncontradas.includes(textoInvertido)) {
    encontrada = textoInvertido;
  }

  if (encontrada) {
    palabrasEncontradas.push(encontrada);
    
    celdasSeleccionadas.forEach(c => {
      c.classList.remove('seleccionada');
      c.classList.add('encontrada');
    });

    const tag = document.getElementById(`tag-${encontrada}`);
    if (tag) tag.classList.add('encontrada');

    celdasSeleccionadas = [];
    actualizarEncabezado();

    if (palabrasEncontradas.length === palabras.length) {
      setTimeout(() => alert('🎉 ¡Felicidades! Encontraste las 15 palabras.'), 200);
    }
  }
}