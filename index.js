/**
 * PSEUDOCODIGO: Randometria
 * #Ruben Donat y Michel Capella#
 *
 * 2 jugadores. El objetivo es adivinar la carta que tiene el rival en función de los intentos.
 *
 * INICIO DEL PROGRAMA:
 *  - Se muestra un menú donde se podrá elegir:
 *      - Iniciar partida
 *      - la configuración del juego:
 *          - Intentos
 *  - Una vez configurado todo (O no, habrán valores por defecto)
 *  - Inicia la partida.
 *  - Se le mostrará la carta al jugador 1, a continuación al jugador 2.
 *  - Al realizar el intento se le mostrará una ayuda (Ej. El número del contrario es mayor/menor que X número)
 *  - Si acierta restará una vida al contrario y viceversa.
 *  - Si falla una vida al jugador de ese turno y viceversa.
 *  - Se acaba el juego cuando gana acertando la carta (número y palo) o un jugador pierde las vidas.
 */
const io = require("console-read-write");
require("colors");

const baraja = {
  espadas: {
    1: "🂡",
    2: "🂢",
    3: "🂣",
    4: "🂤",
    5: "🂥",
    6: "🂦",
    7: "🂧",
    8: "🂨",
    9: "🂩",
    10: "🂪",
    11: "🂫",
    12: "🂭",
    13: "🂮",
  },
  corazones: {
    1: "🂡",
    2: "🂲",
    3: "🂳",
    4: "🂴",
    5: "🂵",
    6: "🂶",
    7: "🂷",
    8: "🂸",
    9: "🂹",
    10: "🂺",
    11: "🂻",
    12: "🂽",
    13: "🂾",
  },
  diamantes: {
    1: "🃁",
    2: "🃂",
    3: "🃃",
    4: "🃄",
    5: "🃅",
    6: "🃆",
    7: "🃇",
    8: "🃈",
    9: "🃉",
    10: "🃊",
    11: "🃋",
    12: "🃍",
    13: "🃎",
  },
  treboles: {
    1: "🃑",
    2: "🃒",
    3: "🃓",
    4: "🃔",
    5: "🃕",
    6: "🃖",
    7: "🃗",
    8: "🃘",
    9: "🃙",
    10: "🃚",
    11: "🃛",
    12: "🃝",
    13: "🃞",
  },
};

let intentos = 3;

let nombre_jugadores = {
  1: {
    nombre: "Jugador_1",
    palo: false,
    num: false,
    vidas: intentos,
  },
  2: {
    nombre: "Jugador_2",
    palo: false,
    num: false,
    vidas: intentos,
  },
};

let carta_jugador1, carta_jugador2;

// *  - Se muestra un menú donde se podrá elegir:
// *      - Iniciar partida
// *      - la configuración del juego:
// *          - Color
// *          - Intentos
async function menu() {
  console.clear();
  console.log("===============================".green);
  console.log("|        RANDOMETRIA          |".green);
  console.log("===============================".green);
  console.log(" 1) EMPEZAR PARTIDA".blue);
  console.log(" 2) CONFIGURACIÓN".blue);
  console.log(" 3) SALIR".red);
  //console.log(nombre_jugadores[1].color.);
  const opc = await io.read({ prompt: "Opción: " });

  switch (opc) {
    case "1":
      game();
      break;
    case "2":
      config();
      break;
    case "3":
      break;
    default:
      console.log("Opción incorrecta. Seleccione una opción válida");
      menu();
      break;
  }
}

async function game() {
  //       - Una vez configurado todo (O no, habrán valores por defecto)
  //  *  - Inicia la partida.
  //  *  - Se le mostrará la carta al jugador 1, a continuación al jugador 2.
  //  *  - Al realizar el intento se le mostrará una ayuda (Ej. El número del contrario es mayor/menos que X número)
  //  *  - Si acierta restará una vida al contrario y viceversa.
  //  *  - Si falla una vida al jugador de ese turno y viceversa.
  //  *  - Se acaba el juego cuando gana acertando la carta (número y palo) o un jugador pierde las vidas.
  console.clear();
  console.log("===============================".green);
  console.log(
    "Elige tu nombre, presiona ENTER para usar nombre por defecto".green
  );
  console.log("===============================".green);
  console.log(" ");

  const n1 = await io.read({
    prompt: "Nombre jugador 1: ",
  });
  const n2 = await io.read({ prompt: "Nombre jugador 2: " });
  if (n1 != "") {
    nombre_jugadores[1].nombre = n1;
  }
  if (n2 != "") {
    nombre_jugadores[2].nombre = n2;
  }
  carta_jugador1 = generarCartas();
  carta_jugador2 = generarCartas();
  if (
    carta_jugador1[0] == carta_jugador2[0] &&
    carta_jugador1[1] == carta_jugador2[1]
  ) {
    //si da la probabilidad que se genere la misma carta generamos una carta random del segundo jugador
    do {
      carta_jugador2 = generarCartas();
    } while (
      carta_jugador1[0] == carta_jugador2[0] &&
      carta_jugador1[1] == carta_jugador2[1]
    );
  }
  let jug = 1;
  let correcto = false;
  do {
    if (jug == 1) {
      console.log(jug);
      await mostrarCarta(nombre_jugadores[jug], carta_jugador1);
    } else {
      await mostrarCarta(nombre_jugadores[jug], carta_jugador2);
    }
    correcto = await adivinarCarta(jug);
    console.log(correcto);
    await io.read();
    jug = jug == 1 ? 2 : 1;
  } while (
    !correcto &&
    nombre_jugadores[1].vidas > 0 &&
    nombre_jugadores[2].vidas > 0
  );

  //felicitamos jugador ganador
  if (correcto) {
    console.clear();
    console.log("============🏆🏆============".green);
    console.log(
      "Enhorabuena " +
        (jug == 1 ? nombre_jugadores[2].nombre : nombre_jugadores[1].nombre) +
        " has adivinado la carta del contrincante!"
    );
    console.log(
      "La carta correcta de " +
        (jug == 1 ? nombre_jugadores[2].nombre : nombre_jugadores[1].nombre) +
        " era " +
        (nombre_jugadores[jug] == 1
          ? carta_jugador2[0] + " " + carta_jugador2[1]
          : carta_jugador1[0] + " " + carta_jugador1[1])
    );
  } else {
    //ha perdido uno de los dos jugadores
    console.clear();
    console.log("============💔💔==========".green);
    console.log(
      "Oh! Vaya has perdido tus vidas " +
        nombre_jugadores[jug] +
        " la próxima vez lo acertarás!"
    );
    console.log(
      "La carta correcta era " + nombre_jugadores[jug] == 1
        ? nombre_jugadores[2]
        : nombre_jugadores[1] + " es " + nombre_jugadores[jug] == 1
        ? carta_jugador2[0] + " " + carta_jugador2[1]
        : carta_jugador1[0] + " " + carta_jugador1[1]
    );
  }
}

async function adivinarCarta(jugador) {
  // aqui miraremos lo que introduce Jugador 1 y compararemos con carta de Jugador 2 y viceversa
  // Menu de que quiere seleccionar (palo y numero)
  console.clear();
  console.log("ADIVINA LA CARTA DEL RIVAL!".green);
  console.log("========================".green);
  console.log("| 1) Palo              |".green);
  console.log("| 2) Numero            |".green);
  console.log("========================".green);
  let opc1 = await io.read({ prompt: "Opción: " });
  switch (opc1) {
    case "1":
      let paloCorrecto = false;

      do {
        let palo = await io.read({ prompt: "Palo: " });
        palo = palo.toLowerCase();
        if (jugador == 1) {
          if (
            palo == "espadas" ||
            palo == "treboles" ||
            palo == "diamantes" ||
            palo == "corazones"
          ) {
            if (palo == carta_jugador2[0]) {
              console.log("Palo correcto!");
              nombre_jugadores[1].palo = true;
            } else {
              console.log("Palo incorrecto!");
              nombre_jugadores[1].vidas--;
            }
            paloCorrecto = true;
          } else {
            paloCorrecto = false;
            console.log("NO existe este palo. Por favor introduzca uno válido");
          }
        }
        if (jugador == 2) {
          if (
            palo == "espadas" ||
            palo == "treboles" ||
            palo == "diamantes" ||
            palo == "corazones"
          ) {
            if (palo == carta_jugador1[0]) {
              console.log("Palo correcto!");
              nombre_jugadores[2].palo = true;
            } else {
              console.log("Palo incorrecto!");
              nombre_jugadores[2].vidas--;
            }
            paloCorrecto = true;
          } else {
            //paloCorrecto = false;
            console.log("NO existe este palo. Por favor introduzca uno válido");
          }
        }
      } while (!paloCorrecto);

      break;
    case "2":
      //numero
      const num = await io.read({ prompt: "Numero(1-13): " });
      if (jugador == 1) {
        if (num == carta_jugador2[1]) {
          console.log("Numero correcto!");
          nombre_jugadores[1].num = true;
        } else {
          console.log("Numero incorrecto!");
          nombre_jugadores[1].vidas--;
        }
      } else {
        if (num == carta_jugador1[1]) {
          console.log("Numero correcto!");
          nombre_jugadores[2].num = true;
        } else {
          console.log("Numero incorrecto!");
          nombre_jugadores[2].vidas--;
        }
      }
      break;
    default:
      console.log("Opción incorrecta. Seleccione una opción válida");
      await io.read({ prompt: "" });
      adivinarCarta(jugador);
      break;
  }

  if (
    (nombre_jugadores[1].palo && nombre_jugadores[1].num) ||
    (nombre_jugadores[2].palo && nombre_jugadores[2].num)
  )
    return true;

  return false;
}

function generarCartas() {
  let palo = ["espadas", "corazones", "diamantes", "treboles"];
  let num = Math.floor(Math.random() * 13) + 1;
  let palo_rand = palo[Math.floor(Math.random() * 4)];
  return [palo_rand, num];
}
async function mostrarCarta(jugador, carta) {
  //["corazones","1"]
  console.clear();
  console.log("===============================".green);
  console.log(`| TU CARTA - ${jugador.nombre}        |`.green);
  console.log(
    `| TUS VIDAS - ${jugador.vidas} `.green + `♥`.red + `             |`.green
  );
  console.log("===============================".green);
  console.log(" ");
  console.log(baraja[carta[0]][carta[1]] + "  " + carta[1] + " de " + carta[0]);
  console.log(" ");
  await io.read({ prompt: "Pulsa cualquier tecla para continuar." });
}

async function config() {
  console.clear();
  console.log("===============================".green);
  console.log("|        CONFIGURACIÓN        |".green);
  console.log("===============================".green);
  console.log(" 1) NUMERO DE INTENTOS: ".blue + intentos);
  console.log(" 2) ATRÁS".red);
  const opc = await io.read({ prompt: "Opción: " });
  switch (opc) {
    case "1":
      console.log("=============================================".green);
      intentos = await io.read({
        prompt: "Numero de intentos (Por defecto 3): ".green,
      });
      console.log("=============================================".green);
      if (intentos < 0) {
        intentos = 3;
        console.log("El numero de intentos no puede ser inferior a 0");
        await io.read({ prompt: "" });
      } else {
        nombre_jugadores[1].vidas = intentos;
        nombre_jugadores[2].vidas = intentos;
      }
      config();
      break;
    case "2":
      menu();
      break;
    default:
      await io.read({
        prompt: "Opción inexistente. Por favor seleccione una opción vàlida",
      });
      config();
      break;
  }
}

menu();
//config();
