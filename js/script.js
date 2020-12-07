// ES6 aggiunge la classe, per cui si potrebbe scrivere box come classe e metterci dentro sia le proprietà che qualche funzione! Provare a pensare se può essere utilizzato VueJS!
// Mettere protezione per gli elementi undefined!
// farlo funzionare con livelli di difficoltà più alti. Per colori numeri fare come esercizio icone

$(document).ready(function() {
  // class Box {
  //  constructor(id, position, bombs, isBomb, isOpened) {
  //     this.id = id;
  //     this.position = position;
  //     this.bombs = bombs;
  //     this.isBomb = isBomb;
  //     this.isOpened = isOpened;
  //   }
  // }

  const fieldBoxes = $("#box_field");

  let level = parseInt(prompt("Scegli il livello"));

  // Creo il campo
  let newField = field(level);

  // genero le bombe
  let newArrayBombs = arrayBombs(level, newField);

  generatefield (level, newField, newArrayBombs, fieldBoxes);

  fieldBoxes.css({"width": `${levelChoise(level)[3]}px`, "height": `${levelChoise(level)[4]}px`});

  $(".box_item").addClass("hide");
  $(".fas").addClass("hide");

  $(".box").each(function(index) {
    $(this).mousedown(function(event) {
      if (event.which == 1 && newField[index].isFlagged == false) {
        newField[index].isOpened = true;
        $(this).css("box-shadow","none");
      }
    });
    $(this).mouseup(function(event) {
      if (event.which == 1 && newField[index].isFlagged == false) {
        $(this).children().removeClass("hide");
        if (isZero(newField[index])) {
          newField[index].isOpened = true;
          openAdiacent($(".box"), newField, newField[index].position[0], newField[index].position[1]);
          console.log("TRUE");
        } else {
          console.log("FALSE");
        }
      } else if (event.which == 3) {
        if (newField[index].isOpened == false && newField[index].isFlagged == false) {
          $(this).html(`
            <i class="fas fa-flag"></i>
          `);
          newField[index].isFlagged = true;
        } else if (newField[index].isFlagged == true){
          if (newField[index].isBomb == true) {
            $(this).html(`<i class="${newField[index].bombs}"></i>`);
          } else {
            $(this).html(`<p class="box_item" style="color:${colors[newField[index].bombs]}">${(newField[index].bombs == 0) ? "" : newField[index].bombs}</p>`);
          }
          $(this).children().addClass("hide");
          newField[index].isFlagged = false;
        }
      }
    });

  });

  // Tolgo il menu che si apre con il tasto destro
  $(document).on("contextmenu",function(){
    return false;
  });

});

//----------- FUNCTIONS ------------------------------------>
const box = {
  position: [0,0],
  bombs: 0,
  isBomb: false,
  id: 0,
  isOpened: false,
  isFlagged: false
};

const colors = ["", "blue","green","red","indigo","orange","brown","pink","black"];

function numbOfBombs(arraybombs, x, y) {
  let numOfBombs = 0;
  const arrayPosAdj = [[x-1, y-1],[x-1, y],[x-1, y+1],[x, y-1],[x, y+1],[x+1, y-1],[x+1, y],[x+1, y+1]];
  for (elem of arrayPosAdj) {
    if (checkBombs(arraybombs, elem[0], elem[1])) {
      numOfBombs += 1;
    }
  }
  return numOfBombs;
}


function generatefield (level, field, arraybombs, fieldBoxes) {
  for (let x=1; x<=levelChoise(level)[1][0]; x++) {
    for (let y=1; y<=levelChoise(level)[1][1]; y++) {
      let id = getId(field, x, y);
      if (!checkBombs(arraybombs, x, y)) {
        let bombs = numbOfBombs(arraybombs, x, y)
        if (!field[id].isBomb) {
          field[id].bombs = bombs;
        }
        // Metto i numeri nello schema
        fieldBoxes.append(`<div class="box"><p class="box_item" style="color:${colors[field[id].bombs]}">${(field[id].bombs == 0) ? "" : field[id].bombs}</p></div>`);
      } else {
        // Metto le bombe nello schema
        fieldBoxes.append(`<div class="box"><i class="${field[id].bombs}"></i></div>`);
      }
    }
  }
}

function includes(value, array) {
  for (elem of array) {
    // rictrollare , magari passare opzionali cosi da poterla riusare qui
      if (equalArray(value, elem, 0, 0)) {
      return true;
    }
  }
  return false;
}

const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function levelChoise(value) {
  let gameLevel,max,bombs,width,height;
  switch(value) {
    case 0:
      gameLevel = randomInteger(0, 80);
      max = [9,9];
      bombs = 10;
      width = 360;
      height = 360;
      break;
    case 1:
      gameLevel = randomInteger(0, 255);
      max = [16,16];
      bombs = 40;
      width = 640;
      height = 640;
      break;
    case 2:
      gameLevel = randomInteger(0, 479);
      max = [16,30];
      bombs = 99;
      width = 1200;
      height = 640;
      break;
  }
  return [gameLevel, max, bombs, width, height];
}

function getId(array, x, y) {
  let id;
  array.forEach(item => {
    if (equalArray(0, item, x, y)) {
      id = item.id;
    }
  });
  return id;
}

function field(level) {
  let i = 0;
  let field = []
  for (let x=1; x<=levelChoise(level)[1][0]; x++) {
    for (let y=1; y<=levelChoise(level)[1][1]; y++) {
      let newBox = Object.create(box);
      newBox.position = [x,y];
      newBox.id = i;
      newBox.isOpened = false;
      newBox.isBomb = false;
      field.push(newBox);
      i += 1;
    }
  }
  return field;
}

function arrayBombs(level, field) {
  let arraybombs = []
  while (arraybombs.length < levelChoise(level)[2]) {
    bomb = levelChoise(level)[0];
    if (!includes(field[bomb].position, arraybombs)) {
      field[bomb].bombs = "fas fa-bomb";
      field[bomb].isBomb = true;
      arraybombs.push(field[bomb]);
    }
  }
  return arraybombs;
}

// rifarla senza some in caso cosi vale per tutti i casi in cui mi serve
const checkBombs = (array, x, y) => array.some(item => equalArray(0, item, x, y));

function isZero(object) {
  return object.bombs == 0;
}

// chiedere o vedere bene questa cosa per gli opzionali
function equalArray(value, item, x, y) {
  if (value != 0) {
    return (value[0] == item.position[0] && value[1] == item.position[1]);
  } else {
    return (item.position[0] == x && item.position[1] == y);
  }
}

// manca da fare il caso in cui l'adiacente non è aperto e ci ho messo una bandierina
function openAdiacent(container, array, x, y) {
  let adjArr = [];
  const arrayPosAdj = [[x-1, y-1],[x-1, y],[x-1, y+1],[x, y-1],[x, y+1],[x+1, y-1],[x+1, y],[x+1, y+1]];
  for (elem of array) {
    for (pos of arrayPosAdj) {
      if (equalArray(0, elem, pos[0], pos[1])) {
        adjArr.push(elem);
        if (elem.isFlagged == false) {
          container.eq(elem.id).css("box-shadow","none");
          container.eq(elem.id).children().removeClass("hide");
        }
      }
    }
  }
  for (item of adjArr) {
    if (isZero(item) && item.isOpened == false) {
      item.isOpened = true;
      openAdiacent(container, array, item.position[0], item.position[1]);
    }
    item.isOpened = true;
  }
}
