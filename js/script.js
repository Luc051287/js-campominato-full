$(document).ready(function() {

  var arraybombs =[];
  var row, column, bomb;
  var field = [];
  var box = {
    position: [0,0],
    bombs: 0,
    isBomb: false
  };

  var level = parseInt(prompt("Scegli il livello"));

  console.log(levelChoise(level));

  for (var x=1; x<=levelChoise(level)[1][0]; x++) {
    for (var y=1; y<=levelChoise(level)[1][1]; y++) {
      let newBox = Object.create(box);
      newBox.position = [x,y];
      field.push(newBox);
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

  var numOfBombs = 0;

  var prova = new Set();
  var counter = 0;

  for (var x=1; x<=levelChoise(level)[1][0]; x++) {
    for (var y=1; y<=levelChoise(level)[1][1]; y++) {
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

  // for (var x=1; x<=levelChoise(level)[1][0]; x++) {
  //   for (var y=1; y<=levelChoise(level)[1][1]; y++) {
  //     if (!checkBombs(arraybombs, x, y)) {
  //
  //       // if
  //
  //       if (checkBombs(arraybombs, x-1, y-1)) {
  //         numOfBombs += 1
  //       }
  //       if (checkBombs(arraybombs, x-1, y)) {
  //         numOfBombs += 1
  //       }
  //       if (checkBombs(arraybombs, x-1, y+1)) {
  //         numOfBombs += 1
  //       }
  //       if (checkBombs(arraybombs, x, y-1)) {
  //         numOfBombs += 1
  //       }
  //       if (checkBombs(arraybombs, x, y+1)) {
  //         numOfBombs += 1
  //       }
  //       if (checkBombs(arraybombs, x+1, y-1)) {
  //         numOfBombs += 1
  //       }
  //       if (checkBombs(arraybombs, x+1, y)) {
  //         numOfBombs += 1
  //       }
  //       if (checkBombs(arraybombs, x+1, y+1)) {
  //         numOfBombs += 1
  //       }
  //     }
  //   }
  // }

  $("#box_field").css({"width": `${levelChoise(level)[3]}px`, "height": `${levelChoise(level)[4]}px`});

  $(".box_item").addClass("hide");

  $(".box").each(function() {
    $(this).mousedown(function(event) {
      if (event.which == 1) {
        $(this).css("box-shadow","none");
      }
    });
    $(this).mouseup(function(event) {
      if (event.which == 1) {
        $(this).children().removeClass("hide");
      }
    });
  });

  // Tolgo il menu che si apre con il tasto destro
  // $(document).on("contextmenu",function(){
  //   return false;
  // });

});

/// FUNCTIONS

function checkIfDiff(value, array) {
  for (elem of array) {
    if (value.join() == elem.position.join()) {
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

// vedere se si riesce ad usare some!
function checkBombs(objects, i, j) {
  let bool = false;
  objects.forEach((elem) => {
    if (elem.position.join("") == [i, j].join("")) {
      bool = true;
    }
  });
  return bool;
}
