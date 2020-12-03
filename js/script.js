$(document).ready(function() {

  const arraybombs =[];
  let bomb;
  const field = [];

  const box = {
    position: [0,0],
    bombs: 0,
    isBomb: false
  };

  let level = parseInt(prompt("Scegli il livello"));

  console.log(levelChoise(level));

  for (let x=1; x<=levelChoise(level)[1][0]; x++) {
    for (let y=1; y<=levelChoise(level)[1][1]; y++) {
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

  let numOfBombs = 0;
  let counter = 0;

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
        openCloserCells(field, $(".box"), index, level);
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

function openCloserCells(objects, container, index, level) {

  for (let x=objects[index].position[0]; x<=levelChoise(level)[1][0]; x++) {
    for (let y=objects[index].position[1]; y<=levelChoise(level)[1][1]; y++) {

      console.log(index);

      if (isZero(objects[index-1])) {
        container.eq(index-1).css("box-shadow","none");
        container.eq(index-1).children().removeClass("hide");
        console.log(index-1);
        // openCloserCells(objects, container, index-1);
      }

      if (isZero(objects[index+1])) {
        container.eq(index+1).css("box-shadow","none");
        container.eq(index+1).children().removeClass("hide");
        console.log(index+1);
        // openCloserCells(objects, container, index-1);
      }

      if (isZero(objects[index-10])) {
        container.eq(index-10).css("box-shadow","none");
        container.eq(index-10).children().removeClass("hide");
        console.log(index-10);
        // openCloserCells(objects, container, index-1);
      }

      if (isZero(objects[index-9])) {
        container.eq(index-9).css("box-shadow","none");
        container.eq(index-9).children().removeClass("hide");
        console.log(index-9);
        // openCloserCells(objects, container, index-1);
      }

      if (isZero(objects[index-8])) {
        container.eq(index-8).css("box-shadow","none");
        container.eq(index-8).children().removeClass("hide");
        console.log(index-8);
        // openCloserCells(objects, container, index-1);
      }

      if (isZero(objects[index+10])) {
        container.eq(index+10).css("box-shadow","none");
        container.eq(index+10).children().removeClass("hide");
        console.log(index+10);
        // openCloserCells(objects, container, index-1);
      }

      if (isZero(objects[index+9])) {
        container.eq(index+9).css("box-shadow","none");
        container.eq(index+9).children().removeClass("hide");
        console.log(index+9);
        // openCloserCells(objects, container, index-1);
      }

      if (isZero(objects[index+8])) {
        container.eq(index+8).css("box-shadow","none");
        container.eq(index+8).children().removeClass("hide");
        console.log(index+8);
        // openCloserCells(objects, container, index-1);
      }
    }
  }
}
