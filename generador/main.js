const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 400,
    backgroundColor: '#4A8FF8',
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

const cartasArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'll', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 'rr', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; // Lista de imágenes de las cartas
var texto="";

var textoSize = texto.length;

const targetawidth = 100;
const targetaheinght = 79;

let canvas = this;

let scrollHorizontal = 0;
let scrollVertical = (targetaheinght/2)+30;
let sencibilidad = 10;
let sencibilidadHorizontal = 100;

let columnas = 28;

let punterox = 0;
let punteroy = 0;

var id = 0;

function preload() {
    // Cargar imágenes de las cartas y del reverso
    canvas = this;
    this.load.image('back', '/generador/assets/back.png');
    cartasArray.forEach((carta, index) => {
      this.load.image(carta, `generador/assets/${carta}.jpeg`);
    });
  
    // Escuchar el evento 'Enter' dentro del campo de entrada
    var inputField = document.getElementById('entrada');
    inputField.value = "";
    inputField.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        var userInput = inputField.value;
        texto = inputField.value;
        textoSize = texto.length;
        console.log('Valor ingresado:', userInput);
        actualizar(canvas, texto, scrollVertical,scrollHorizontal); // Llamar a la función de actualización
        speak(texto);
        // Limpiar el campo de entrada
      }
    });

    //Controles
    var boton = document.getElementById('generar');
    boton.addEventListener('click', (event) => {
        var userInput = inputField.value;
        texto = inputField.value;
        textoSize = texto.length;
        console.log('Valor ingresado:', userInput);
        scrollHorizontal = 0;
        scrollVertical = 30+targetaheinght/2;
        actualizar(canvas, texto, scrollVertical,scrollHorizontal); // Llamar a la función de actualización
        speak(texto);
    });

    window.addEventListener('wheel', function(event) {
        // Detectar la dirección del giro de la rueda
        if (event.deltaY < 0) {
            console.log('Rueda hacia abajo');
            scrollVertical = scrollVertical-sencibilidad;
            /*if(scrollVertical<(targetaheinght/2)+30){
              scrollVertical=(targetaheinght/2)+30;
            }*/
            console.log(scrollVertical);
            actualizar(canvas, texto, scrollVertical,scrollHorizontal);
        } else {
            console.log('Rueda hacia arriba');
            scrollVertical = scrollVertical+sencibilidad;
            console.log(scrollVertical);
            actualizar(canvas, texto, scrollVertical,scrollHorizontal);
        }

        // Evitar el comportamiento predeterminado
        event.preventDefault();
    });

    //FUNCION PARA EL SCROLLING HORIZONTAL

    var bnizquierda = document.getElementById("bnizquierda");
    bnizquierda.addEventListener('click', (event) => {
      console.log("izquierda presionado");
      console.log("derecha presionado");
      scrollHorizontal = scrollHorizontal+sencibilidadHorizontal;
      if(scrollHorizontal>0){
        scrollHorizontal=0;
      }  
      actualizar(canvas, texto, scrollVertical,scrollHorizontal);
     });

    var bnderecha = document.getElementById("bnderecha");
    bnderecha.addEventListener('click', (event) => {
      event.preventDefault(); // Previene la acción por defecto de F1
      console.log("derecha presionado");
      scrollHorizontal = scrollHorizontal-sencibilidadHorizontal;
      //EL NUMERO 11 ES PARA ESPECIFICAR CUANTAS VECES CABEN
      if(scrollHorizontal<getX(columnas-8)*(-1)){
        scrollHorizontal=getX(columnas-8)*(-1);
      }
      actualizar(canvas, texto, scrollVertical,scrollHorizontal);
     });


    window.addEventListener('keydown', function(event) {
      // Prevenir que el navegador realice la acción predeterminada de F1 (abrir ayuda)
      if (event.key === 'F1') {
          event.preventDefault(); // Previene la acción por defecto de F1
          console.log("F1 presionado");
          scrollHorizontal = scrollHorizontal-sencibilidadHorizontal;

          //EL NUMERO 11 ES PARA ESPECIFICAR CUANTAS VECES CABEN
          if(scrollHorizontal<getX(columnas-8)*(-1)){
            scrollHorizontal=getX(columnas-8)*(-1);
          }
          
          actualizar(canvas, texto, scrollVertical,scrollHorizontal);
      }
      if (event.key === 'F2') {
          console.log("F2 presionado");
          
          actualizar(canvas, texto, scrollVertical,scrollHorizontal);
      }
    });

    actualizar(canvas, texto);

  }
  
  function create() {
    // Crear las cartas iniciales o la lógica inicial
    //EVENTOS
    actualizar(canvas, texto); // Crear el texto inicial
  }
  
  function actualizar(scene, texto, scrollVertical, scrollHorizontal) {
    console.log("actualizar");

    punterox = 0;
    punteroy = 0;

    console.log("log1");
    // Limpiar las cartas ante iores si existen
    if (cartas) {
      cartas.clear(true, true); // Limpiar el grupo de cartas
    }
  
    console.log("log2");
    // Crear un grupo para las nuevas cartas
    cartas = canvas.add.group();
    
    // Dividir el texto en sílabas o caracteres
    //let silabas = jsESsyllable.divide(texto);
    //console.log(silabas);
    console.log("log3");
    const borderThickness = 1; // Grosor del borde
    
    console.log("log4");

    // Calcular el ancho total de las cartas y centrar
    const totalWidth = textoSize * targetawidth; // Ancho total de todas las cartas
    const startX = (game.config.width - totalWidth) / 2; // Punto inicial para centrar las cartas

    console.log("log5");

    //texto = "abcdefghijklmnñopqrstuvwxyz";
    texto = texto.toLowerCase()
    .replace(/[@,.,#,%,$,&,]/g, "")  // Reemplazar caracteres especiales, incluyendo la coma
    .replace(/é/g, "e")  // Reemplazar "é" por "e"
    .replace(/á/g, "a")  // Reemplazar "á" por "a"
    .replace(/í/g, "i")  // Reemplazar "í" por "i"
    .replace(/ó/g, "o")  // Reemplazar "ó" por "o"
    .replace(/ú/g, "u"); // Reemplazar "ú" por "u"
    
    console.log("log6");

    let palabras = texto.split(" ");
    console.log(palabras);
    
    console.log("log7");

    palabras.forEach(function(palabra){

      console.log("logciclo");

      console.log("palabra a imprmir "+palabra);
      
      console.log("el size de la palabra es "+palabra.length);
      console.log("el puntero "+punterox);
      if(palabra.length+punterox>=columnas){
        punteroy = punteroy+1;
        punterox = 1;
      }
      
      for(let i=0;i<palabra.length;i++){
        console.log(palabra[i]);

        let x = getX(punterox)+scrollHorizontal;
        //scrollVertical = 339.5;
        let y = getY(punteroy)+scrollVertical;


        /*const border = canvas.add.graphics();
        border.lineStyle(borderThickness, 0xffffff); // Color blanco y grosor del borde
        border.strokeRect(x - targetawidth / 2 - borderThickness / 2, y - targetaheinght / 2 - borderThickness / 2, targetawidth + borderThickness, targetaheinght + borderThickness);
        */

        // Dibujar la carta (usando la letra o el gráfico correspondiente)
        const sprite = canvas.add.sprite(x, y, palabra[i]).setInteractive();
        sprite.name = palabra[i]; // Asignar nombre o mensaje al sprite

        // Agregar el evento 'pointerdown' (clic o toque)
        sprite.on('pointerdown', function () {
            console.log("Sprite presionado con el id "+sprite.name);
            speak(sprite.name);
        });
        // Agregar cada sprite al grupo de cartas
        cartas.add(sprite);
    
        // Ajustar el tamaño del sprite
        sprite.setDisplaySize(targetaheinght, targetawidth);

        punterox++;
        id++;
      }
      punterox++;
    });

    console.log("log8");

  }
  

//FUNCION PARA ESTABLECER LA POSICION DE LAS TARGETAS SEGUN SEA LA CANTIDAD DE TEXTO

function getX(index){
  return (index*((targetawidth)))+(targetawidth/2);
}

/*function getX(index){
    console.log("i : "+index+" > X = "+((index % columnas)*targetawidth)+(targetawidth/2)+1)
    return ((index % columnas)*targetawidth)+(targetawidth/2)+1;
}*/

function getY(index){
  return index*(targetaheinght+30);
}

/*function getY(index){

    let y = (Math.floor(index/columnas)*(targetaheinght+30));
    //y=y+((fila*targetaheinght));
    console.log("i : "+index+" > y = "+y)
    //return ((index % columnas)*targetawidth)+(targetawidth/2)+1;
    return y;
}*/

function speak(texto) {
    // Create a SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(texto);
  
    // Select a voice
    const voices = speechSynthesis.getVoices();
    console.log(voices);
    utterance.voice = voices[4]; // Choose a specific voice

    utterance.rate = 0.8;

    // Speak the text
    speechSynthesis.speak(utterance);
  }

  document.addEventListener("DOMContentLoaded", function() {
    // Tu función aquí
    actualizar(canvas,texto);
    console.log("La página se ha cargado completamente.");
  });
//excepciones