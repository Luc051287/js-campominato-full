$(document).ready(function() {

  var arrayCpu =[];
  var row, column;
  var field = [];
  var bomb;

  var level = parseInt(prompt("Scegli il livello"));

  console.log(levelChoise(level));

  for (var x=1; x<=levelChoise(level)[1][0]; x++) {
    row = x;
    for (var y=1; y<=levelChoise(level)[1][1]; y++) {
      column = y;
      field.push([row,column]);
    }
  }

  console.log(field);

  while (arrayCpu.length < levelChoise(level)[2]) {
    bomb = levelChoise(level)[0];
    console.log(bomb);
    console.log(field[bomb]);
    if (checkIfDiff(field[bomb], arrayCpu)) {
      arrayCpu.push(field[bomb]);
    }
  }

  console.log(arrayCpu);

  var numOfBombs = 0;
  for (var x=1; x<=levelChoise(level)[1][0]; x++) {
    for (var y=1; y<=levelChoise(level)[1][1]; y++) {
      numOfBombs = 0;
      if (!mySome(arrayCpu, x, y)) {
        if (mySome(arrayCpu, x-1, y-1)) {
          numOfBombs += 1
        }
        if (mySome(arrayCpu, x-1, y)) {
          numOfBombs += 1
        }
        if (mySome(arrayCpu, x-1, y+1)) {
          numOfBombs += 1
        }
        if (mySome(arrayCpu, x, y-1)) {
          numOfBombs += 1
        }
        if (mySome(arrayCpu, x, y+1)) {
          numOfBombs += 1
        }
        if (mySome(arrayCpu, x+1, y-1)) {
          numOfBombs += 1
        }
        if (mySome(arrayCpu, x+1, y)) {
          numOfBombs += 1
        }
        if (mySome(arrayCpu, x+1, y+1)) {
          numOfBombs += 1
        }
        $("#box_field").append(`<div class="box"><p class="box_item">${numOfBombs}</p></div>`);
      } else {
        $("#box_field").append(`<div class="box"><p class="box_item">B</p></div>`);
      }
    }
  }
  $("#box_field").css({"width": `${levelChoise(level)[3]}px`, "height": `${levelChoise(level)[4]}px`});

  $(".box_item").addClass("hide");

});

/// FUNCTIONS

// function fieldBuild (arg1, arg2) {
//   var array = [];
//   for (let x=1; x<=10; x++) {
//     arg1 = x;
//     for (let y=1; y<=10; y++) {
//       arg2 = y;
//       array.push([arg1,arg2]);
//     }
//   }
//   return array;
// }

function checkIfDiff(value, array) {
  for (elem of array) {
    if (value.join() == elem.join()) {
      return false;
    }
  }
  return true;
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function mySome(array, i, j) {
  return array.some(item => item.join("") == [i, j].join(""))
}
