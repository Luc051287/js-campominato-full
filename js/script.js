// ES6 aggiunge la classe, per cui si potrebbe scrivere box come classe e metterci dentro sia le proprietà che qualche funzione! Provare a pensare se può essere utilizzato VueJS!
// Mettere protezione per gli elementi undefined! 

$(document).ready(function() {

  const arraybombs =[];
  const field = [];

  const box = {
    position: [0,0],
    bombs: 0,
    isBomb: false,
    id: 0,
    opened: false
  };

  let level = parseInt(prompt("Scegli il livello"));

  console.log(levelChoise(level));

  let contatore = 0;

  for (let x=1; x<=levelChoise(level)[1][0]; x++) {
    for (let y=1; y<=levelChoise(level)[1][1]; y++) {
      let newBox = Object.create(box);
      newBox.position = [x,y];
      newBox.id = contatore;
      field.push(newBox);
      contatore += 1;
    }
  }

  console.log(field);

  while (arraybombs.length < levelChoise(level)[2]) {
    bomb = levelChoise(level)[0];
    if (checkIfDiff(field[bomb].position, arraybombs)) {
      field[bomb].bombs = "B";
      field[bomb].isBomb = true;
      arraybombs.push(field[bomb]);
    }
  }

  console.log(arraybombs);

  let numOfBombs = 0;
  let counter = 0;


  // Provare a fare foreach con funzione
  for (let x=1; x<=levelChoise(level)[1][0]; x++) {
    for (let y=1; y<=levelChoise(level)[1][1]; y++) {
      numOfBombs = 0;
      if (!checkBombs(arraybombs, x, y)) {
        if (checkBombs(arraybombs, x-1, y-1)) {
          numOfBombs += 1
        }
        if (checkBombs(arraybombs, x-1, y)) {
          numOfBombs += 1
        }
        if (checkBombs(arraybombs, x-1, y+1)) {
          numOfBombs += 1
        }
        if (checkBombs(arraybombs, x, y-1)) {
          numOfBombs += 1
        }
        if (checkBombs(arraybombs, x, y+1)) {
          numOfBombs += 1
        }
        if (checkBombs(arraybombs, x+1, y-1)) {
          numOfBombs += 1
        }
        if (checkBombs(arraybombs, x+1, y)) {
          numOfBombs += 1
        }
        if (checkBombs(arraybombs, x+1, y+1)) {
          numOfBombs += 1
        }

        if (!field[counter].isBomb) {
          field[counter].bombs = numOfBombs;
        }

        $("#box_field").append(`<div class="box"><p class="box_item">${field[counter].bombs}</p></div>`);

        counter += 1;

      } else {
        $("#box_field").append(`<div class="box"><p class="box_item">${field[counter].bombs}</p></div>`);

        counter += 1;
      }
    }
  }

  console.log(field);

  let secondCounter = 0;
  let prova = [];


  $("#box_field").css({"width": `${levelChoise(level)[3]}px`, "height": `${levelChoise(level)[4]}px`});

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
      if (isZero(field[index])) {
        field[index].opened = true;
        openAdiacent($(".box"), field, field[index].position[0], field[index].position[1]);
        console.log(field);
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

/// FUNCTIONS

// vedere se usare includes
function checkIfDiff(value, array) {
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
      max = [30,16];
      bombs = 99;
      width = 1200;
      height = 640;
      break;
  }

  return [gameLevel, max, bombs, width, height];
}

const checkBombs = (objects, i, j) => objects.some(item => item.position.join("") == [i, j].join(""));

function isZero(object) {
  return object.bombs == 0;
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
    console.log(newArr);
    for (item of newArr) {
      if (isZero(item) && item.opened == false) {
        console.log(item);
        item.opened = true;
        openAdiacent(container, array, item.position[0], item.position[1]);
      }
      item.opened = true;
    }
}
