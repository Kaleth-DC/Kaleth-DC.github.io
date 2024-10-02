const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 700,
  backgroundColor: '#2d2d2d',
  parent: 'game-container', // Ensure the game is rendered inside the container
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

let cartas;
let primeraCarta = null;
let segundaCarta = null;
let bloqueaInput = false;

const cartasArray = ['1', '2', '3', '4', '5', '6']; // Lista de imágenes de las cartas

function preload() {
  // Cargar imágenes de las cartas y del reverso
  this.load.image('back', 'back.png');
  cartasArray.forEach((carta, index) => {
    this.load.image(carta, `${carta}.png`);
  });
}

function create() {
  // Crear un array con las cartas duplicadas y luego mezclarlo
  const cartasMezcladas = Phaser.Utils.Array.Shuffle([...cartasArray, ...cartasArray]);

  cartas = this.add.group();

  // Posicionar las cartas en una cuadrícula 4x3
  let fila = 0;
  let columna = 0;

  cartasMezcladas.forEach((carta, index) => {
    const sprite = this.add.sprite(150 + columna * 160, 150 + fila * 200, 'back').setInteractive();
    
    // Almacena el nombre de la carta asociada a este sprite
    sprite.cartaId = carta;

    // Escalar la carta al tamaño adecuado (192x142)
    sprite.setDisplaySize(192, 142);

    sprite.on('pointerup', () => {
      if (bloqueaInput || sprite.mostrada) return;

      voltearCarta(sprite, this);
    });

    cartas.add(sprite);

    columna++;
    if (columna === 4) {
      columna = 0;
      fila++;
    }
  });
}

function voltearCarta(sprite, scene) {
  // Mostrar la carta correspondiente
  sprite.setTexture(sprite.cartaId);
  sprite.mostrada = true;

  if (!primeraCarta) {
    // Asignar la primera carta seleccionada
    primeraCarta = sprite;
  } else {
    // Asignar la segunda carta y bloquear input temporalmente
    segundaCarta = sprite;
    bloqueaInput = true;

    // Verificar si las cartas coinciden
    if (primeraCarta.cartaId === segundaCarta.cartaId) {
      // Las cartas coinciden
      primeraCarta = null;
      segundaCarta = null;
      bloqueaInput = false;
    } else {
      // Las cartas no coinciden, voltearlas nuevamente después de un tiempo
      scene.time.delayedCall(1000, () => {
        primeraCarta.setTexture('back');
        segundaCarta.setTexture('back');
        primeraCarta.mostrada = false;
        segundaCarta.mostrada = false;
        primeraCarta = null;
        segundaCarta = null;
        bloqueaInput = false;
      });
    }
  }
}