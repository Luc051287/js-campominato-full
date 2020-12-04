// ES6 aggiunge la classe, per cui si potrebbe scrivere box come classe e metterci dentro sia le proprietà che qualche funzione! Provare a pensare se può essere utilizzato VueJS!
// Mettere protezione per gli elementi undefined!
// farlo funzionare con livelli di difficoltà più alti

$(document).ready(function() {

  // const box = {
  //   position: [0,0],
  //   bombs: 0,
  //   isBomb: false,
  //   id: 0,
  //   opened: false
  // };


  class Box {
   constructor(id, position, bombs, isBomb, isOpened) {
      this.id = id;
      this.position = position;
      this.bombs = bombs;
      this.isBomb = isBomb;
      this.isOpened = isOpened;
    }
  }

  const fieldBoxes = $("#box_field");

  let level = parseInt(prompt("Scegli il livello"));

  // Creo il campo
  let newField = field(level);

  // genero le bombe
  let newArrayBombs = arrayBombs(level, newField);

  generatefield (level, newField, newArrayBombs, fieldBoxes);

  fieldBoxes.css({"width": `${levelChoise(level)[3]}px`, "height": `${levelChoise(level)[4]}px`});

  $(".box_item").addClass("hide");

  $(".box").each(function(index) {
    $(this).mousedown(function(event) {
      if (event.which == 1) {
        $(this).css("box-shadow","none");
      }
    });
    $(this).mouseup(function(event) {
      if (event.which == 1) {
        $(this).children().removeClass("hide");
      };
      if (isZero(newField[index])) {
        newField[index].isOpened = true;
        openAdiacent($(".box"), newField, newField[index].position[0], newField[index].position[1]);
        console.log("TRUE");
      } else {
        console.log("FALSE");
      }
    });
  });

  // Tolgo il menu che si apre con il tasto destro
  // $(document).on("contextmenu",function(){
  //   return false;
  // });

});

//----------- FUNCTIONS ------------------------------------>

function numbOfBombs(arraybombs, x, y) {
  let numOfBombs = 0;
  const array = [[x-1, y-1],[x-1, y],[x-1, y+1],[x, y-1],[x, y+1],[x+1, y-1],[x+1, y],[x+1, y+1]];
  for (elem of array) {
    if (checkBombs(arraybombs, elem[0], elem[1])) {
      numOfBombs += 1;
    }
  }
  return numOfBombs;
}


function generatefield (level, field, arraybombs, fieldBoxes) {
  for (let x=1; x<=levelChoise(level)[1][0]; x++) {
    for (let y=1; y<=levelChoise(level)[1][1]; y++) {
      console.log(x,y);
      console.log(field);
      let id = getId(field, x, y);

      if (!checkBombs(arraybombs, x, y)) {

        let bombs = numbOfBombs(arraybombs, x, y)
        console.log(field[id]);
        if (!field[id].isBomb) {
          field[id].bombs = bombs;
        }
        // Metto i numeri nello schema
        fieldBoxes.append(`<div class="box"><p class="box_item">${field[id].bombs}</p></div>`);
      } else {
        // Metto le bombe nello schema
        fieldBoxes.append(`<div class="box"><p class="box_item">${field[id].bombs}</p></div>`);
      }
    }
  }
}

function includes(value, array) {
  for (elem of array) {
    if (value.join() == elem.position.join()) {
      return false;
    }
  }
  return true;
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
  console.log(x,y)
  array.forEach(item => {
    // console.log(item.position);
    // console.log([x, y]);
    if (equalArray(item, x, y)) {
      id = item.id;
    }
  });
  console.log(id);
  return id;
}

function field(level) {
  let i = 0;
  let field = []
  for (let x=1; x<=levelChoise(level)[1][0]; x++) {
    for (let y=1; y<=levelChoise(level)[1][1]; y++) {
      let newBox = new Object();
      newBox.position = [x,y];
      newBox.id = i;
      newBox.isOpened = false;
      newBox.isBomb = false;
      field.push(newBox);
      i += 1;
    }
  }
  console.log(field);
  return field;
}

function arrayBombs(level, field) {
  let arraybombs = []
  while (arraybombs.length < levelChoise(level)[2]) {
    bomb = levelChoise(level)[0];
    if (includes(field[bomb].position, arraybombs)) {
      field[bomb].bombs = "B";
      field[bomb].isBomb = true;
      arraybombs.push(field[bomb]);
    }
  }
  return arraybombs;
}

// rifarla senza some in caso cosi vale per tutti i casi in cui mi serve
const checkBombs = (array, x, y) => array.some(item => equalArray(item, x, y));

function isZero(object) {
  return object.bombs == 0;
}

function equalArray(item, x, y) {
  return (item.position[0] == x && item.position[1] == y)
}

function openAdiacent(container, array, x, y) {
    let newArr = [];
    for (elem of array) {
      if (elem.position.join("") == [x-1,y-1].join("")) {
        newArr.push(elem);
        container.eq(elem.id).css("box-shadow","none");
        container.eq(elem.id).children().removeClass("hide");
      }
      if (elem.position.join("") == [x-1,y].join("")) {
        newArr.push(elem);
        container.eq(elem.id).css("box-shadow","none");
        container.eq(elem.id).children().removeClass("hide");
      }
      if (elem.position.join("") == [x-1,y+1].join("")) {
        newArr.push(elem);
        container.eq(elem.id).css("box-shadow","none");
        container.eq(elem.id).children().removeClass("hide");
      }
      if (elem.position.join("") == [x,y+1].join("")) {
        newArr.push(elem);
        container.eq(elem.id).css("box-shadow","none");
        container.eq(elem.id).children().removeClass("hide");
      }
      if (elem.position.join("") == [x+1,y+1].join("")) {
        newArr.push(elem);
        container.eq(elem.id).css("box-shadow","none");
        container.eq(elem.id).children().removeClass("hide");
      }
      if (elem.position.join("") == [x+1,y].join("")) {
        newArr.push(elem);
        container.eq(elem.id).css("box-shadow","none");
        container.eq(elem.id).children().removeClass("hide");
      }
      if (elem.position.join("") == [x+1,y-1].join("")) {
        newArr.push(elem);
        container.eq(elem.id).css("box-shadow","none");
        container.eq(elem.id).children().removeClass("hide");
      }
      if (elem.position.join("") == [x,y-1].join("")) {
        newArr.push(elem);
        container.eq(elem.id).css("box-shadow","none");
        container.eq(elem.id).children().removeClass("hide");
      }
    }

    for (item of newArr) {
      if (isZero(item) && item.isOpened == false) {
        item.isOpened = true;
        openAdiacent(container, array, item.position[0], item.position[1]);
      }
      item.isOpened = true;
    }
}
