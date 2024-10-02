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
const imgArray = [
  "piña",
  "zanahoria",
  "casa",
  "gato",
  "gota",
  "león",
  "libro",
  "lluvia",
  "niños",
  "ojo",
  "oso",
  "piña",
  "sol"
];

let objectPropertiesMap = {};

var texto="";
var textoSize = texto.length;

let labeltext;
let labeltextvalue = "";
let letrasprecionadas = "";

let completado = false;

const targetawidth = 100;
const targetaheinght = 79;
const imgwidth = 200;
const imgheinght = 200;

let canvas = this;

let select = "";

let scrollHorizontal = 0;
let scrollVertical = (targetaheinght/2)+30;
let sencibilidad = 10;
let sencibilidadHorizontal = 100;

let columnas = 28;

let punterox = 0;
let punteroy = 0;

//ESTADOS DEL JUEGO
/*
  0 : NO INICIADO
  1 : INICIADO
  2 : TERMINADO
*/
let juego = 0;


var id = 0;

function preload() {
    // Cargar imágenes de las cartas y del reverso
    canvas = this;
    
    //CARGAR TARGETAS
    cartasArray.forEach((carta, index) => {
      this.load.image(carta, `señas/assets/${carta}.jpeg`);
    });
    
    //CARGAR IMAGES
    imgArray.forEach((img,index) => {
      this.load.image(img, `señas/assets/img/${img}.png`);
    });

    //Controles------------------------------------------------

    //BOTON PARA INICIAR EL JUEGO
    var boton = document.getElementById('generar');
    boton.addEventListener('click', (event) => {
        juego = 1;
        objectPropertiesMap = {};
        letrasprecionadas = "";
        completado = false;
        actualizar(canvas, texto, scrollVertical,scrollHorizontal); // Llamar a la función de actualización
    });
    
    var bnizquierda = document.getElementById("bnizquierda");
    bnizquierda.addEventListener('click', (event) => {
      console.log("izquierda presionado");
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

    // Limpiar las cartas ante iores si existen
    if (cartas) {
      cartas.clear(true, true); // Limpiar el grupo de cartas
    }
  
    // Crear un grupo para las nuevas cartas
    cartas = canvas.add.group();
    
    const borderThickness = 1; // Grosor del borde

    // Calcular el ancho total de las cartas y centrar
    const totalWidth = textoSize * targetawidth; // Ancho total de todas las cartas
    const startX = (game.config.width - totalWidth) / 2; // Punto inicial para centrar las cartas

    texto = "abcdefghijklmnñopqrstuvwxyz";
    texto = texto.toLowerCase()
    .replace(/[@,.,#,%,$,&,]/g, "")  // Reemplazar caracteres especiales, incluyendo la coma
    .replace(/é/g, "e")  // Reemplazar "é" por "e"
    .replace(/á/g, "a")  // Reemplazar "á" por "a"
    .replace(/í/g, "i")  // Reemplazar "í" por "i"
    .replace(/ó/g, "o")  // Reemplazar "ó" por "o"
    .replace(/ú/g, "u"); // Reemplazar "ú" por "u"
    
    //AGREGAR IMAGEN
    //PREPARANDO LOS COMPONENTES
    if(juego == 1){
      select = getRandom(0,imgArray.length-1);
      labeltextvalue="";
      //CONFIGURAMOS LA PALABLA CLAVE
      for(let i=0;i<imgArray[select].length;i++){
        labeltextvalue=labeltextvalue+"_";
      }

      juego = 2;
    }


    if(juego == 2){
      const img = canvas.add.sprite(150,150,imgArray[select]).setInteractive();
      img.name = imgArray[select];
      cartas.add(img);
      img.setDisplaySize(imgwidth, imgheinght);

      //IMPRIMIR TARGETAS
    for(let i=0;i<texto.length;i++){
      console.log(texto[i]);

      //OBTEMOS LAS PROPIEDADES DEL DEL OBJETO SI EXISTEN
      let currentProperties = {
        id: texto[i],
        estado: 0,
      };
      
      // Verifica si el valor NO es null o undefined antes de asignarlo a currentProperties
      if (objectPropertiesMap[texto[i]] != null) {
        currentProperties = objectPropertiesMap[texto[i]];
      }

      let x = getX(punterox)+scrollHorizontal;
      scrollVertical = 339.5;
      let y = getY(punteroy)+scrollVertical;

      objectPropertiesMap[currentProperties.id] = currentProperties;

      /*const border = canvas.add.graphics();
      border.lineStyle(borderThickness, 0xffffff); // Color blanco y grosor del borde
      border.strokeRect(x - targetawidth / 2 - borderThickness / 2, y - targetaheinght / 2 - borderThickness / 2, targetawidth + borderThickness, targetaheinght + borderThickness);
      */

      // Dibujar la carta (usando la letra o el gráfico correspondiente)
      const sprite = canvas.add.sprite(x, y, texto[i]).setInteractive();
      sprite.name = currentProperties; // Asignamos propiedades

      // Agregar el evento 'pointerdown' (clic o toque)
      sprite.on('pointerdown', function () {
          console.log("Sprite presionado con el id "+sprite.name.id);

          if(currentProperties.estado == 0){
            letrasprecionadas = letrasprecionadas+sprite.name.id;
          }
          //MODIFICAMOS EL ESTADO DEL CURRENTPROPERTIES
          currentProperties.estado = seleccionarTargeta(sprite,letrasprecionadas);
          //REESCRIBIMOS LAS PROPIEDADES DE LAS PROPIEDADES
          sprite.name = currentProperties;

          if(currentProperties.estado == 1){
            sprite.setTint(0xff0000);
          }else if(currentProperties.estado == 2){
            sprite.setTint(0x00ff00);
          }
          
          objectPropertiesMap[sprite.name.id] = currentProperties;
          console.log("propiedades "+JSON.stringify(currentProperties));
          //sprite.setTint(0xff0000);
          speak(sprite.name.id);
          actualizar(canvas, labeltextvalue, scrollVertical,scrollHorizontal);
      });
      // Agregar cada sprite al grupo de cartas
      cartas.add(sprite);
      // Ajustar el tamaño del sprite
      sprite.setDisplaySize(targetaheinght, targetawidth);

      if(currentProperties.estado == 1){
        sprite.setTint(0xff0000);
      }else if(currentProperties.estado == 2){
        sprite.setTint(0x00ff00);
      }

      punterox++;
      id++;
    }
    
    setText(labeltextvalue);

  }

  }

  function setText(text){

    //SE ELIMINA EL TEXTO ANTERIOR PARA EVITAR QUE SE SOBREESCRIBAN
    if (labeltext) {
      labeltext.destroy();
    }

    //AGREGAR TEXTO--------------------------------------
    labeltext = canvas.add.text(450, 100, text, {
      fontFamily: 'MiFuentePersonalizada', // Especificar la fuente
      fontSize: '52px',
      fontStyle: 'bold', // Estilo en negrita
      fill: '#ffffff' // Color del texto
    });
    labeltext.setOrigin(0.5, 0.5);

  }

  function seleccionarTargeta(sprite,letrasprecionadas){
    
    if(completado){
      return 0;
    }
    let coincidencias = 1;
    completado = true;
    
    labeltextvalue = "";
    
    console.log(letrasprecionadas);
    for(let i=0;i<imgArray[select].length;i++){
      //SI LOS CARACTERES SON LOS MISMOS
      var vacio = true;

      if(sprite.name.id == imgArray[select][i]){
        coincidencias = 2;
      }

      for(let p=0;p<letrasprecionadas.length;p++){
        //SI ALGUNA DE LAS LETRAS YA PRECIONADAS YA EXISTEN
        if(letrasprecionadas[p] == imgArray[select][i]){
          labeltextvalue=labeltextvalue+letrasprecionadas[p];
          vacio = false
        }
      }
      if(vacio){
        labeltextvalue=labeltextvalue+"_";
        completado = false;
      }
    }

    if(completado){
      speak("Muy bien Hecho!, la palabra secreta es :"+labeltextvalue);
    }

    return coincidencias;

  }

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //FUNCION PARA ESTABLECER LA POSICION DE LAS TARGETAS SEGUN SEA LA CANTIDAD DE TEXTO
  function getX(index){
    return (index*((targetawidth)))+(targetawidth/2);
  }

  function getY(index){
    return index*(targetaheinght+30);
  }

  function reemplazarVocalesAcentuadas(texto) {
    return texto.replace(/[áéíóúÁÉÍÓÚ]/g, (vocal) => {
        switch (vocal) {
            case 'á': return 'a';
            case 'é': return 'e';
            case 'í': return 'i';
            case 'ó': return 'o';
            case 'ú': return 'u';
            case 'Á': return 'A';
            case 'É': return 'E';
            case 'Í': return 'I';
            case 'Ó': return 'O';
            case 'Ú': return 'U';
            default: return vocal;
        }
    });
}


  //FUNCION PARA ACTIVAR EL TTS
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

  //FUNCION PARA RECARGAR EL JUEGO CUANDO SE TERMINA DE CARGAR LA PAGINA
  document.addEventListener("DOMContentLoaded", function() {
    // Tu función aquí
    actualizar(canvas,texto);
    console.log("La página se ha cargado completamente.");
  });


  //excepciones