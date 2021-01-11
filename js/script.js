// Vedere se si può destrutturare
// const {name, prefix, family, color} = item;

$(document).ready(function() {

  const fieldBoxes = $("#box_field");
  const totFlags = $("#number_of_flags");
  const selected = $(".selected");
  seconds = $("#seconds");
  minutes = $("#minutes");
  hours = $("#hours");
  secondsInt = 0;
  minutesInt = 0;
  hoursInt = 0;
  let newField;
  let newArrayBombs;
  let level = 0;
  let flags = levelChoise(level)[2];
  totFlags.text(flags);
  game(level);

  const timer = new Timer(timerCount, 1000);

  $("#reset").click(function() {
    timer.restart();
    game(level);
  })

  $("#restart").click(function() {
    timer.restart();
    game(level);
    $("#winner").hide();
  })

  selected.click(function() {
    $(this).toggleClass("open");
    $(".options").slideToggle();
  });

  $(document).on("mouseenter", ".options > li:not(.opened)", function() {
    $(this).addClass("hover");
  });

  $(document).on("mouseleave", ".options > li:not(.opened)", function() {
    $(this).removeClass("hover");
  });

  $("ul.options > li").click(function() {
    // ATTENZIONE!!!! Quando il livello è medio o difficile l'animazione del bottone parte in ritardo! Da controllare!
    timer.restart();
    const index = $(this).index();
    const openedItem = $("ul.options > li.opened");
    openedItem.removeClass("opened");
    $(this).removeClass("hover").addClass("opened");
    selected.children("span").html($(this).children("span").text());
    selected.toggleClass("open");
    $(".options").slideUp();
    game(index);
    $("#reset").click(function() {
      timer.restart();
      game(index);
    });
    $("#restart").click(function() {
      timer.restart();
      game(index);
      $("#winner").hide();
    });
  });

  // Gioco
  function game(level) {
    // $(document).on({field: newField}, "mousedown", ".box", mouseDown)
    fieldBoxes.empty();
    // Creo il campo
    newField = field(level);

    // genero le bombe
    newArrayBombs = arrayBombs(level, newField);

    generatefield (level, newField, newArrayBombs, fieldBoxes);
    flags = levelChoise(level)[2];
    totFlags.text(flags);
    fieldBoxes.css({"width": `${levelChoise(level)[3]}px`, "height": `${levelChoise(level)[4]}px`});

    $(".box_item").addClass("hide");
    $(".fas").addClass("hide");

    $(".box").mousedown( function(event) {
      // globale, viene letto anche dal mouseup
      index = $(this).index();
      const {isFlagged, isDoubt} = newField[index];
      if (event.which == 1 && isFlagged == false && isDoubt == false) {
        newField[index].isOpened = true;
        $(this).css("box-shadow","none");
        $(this).css("background-color","white");
      }
    });

    $(".box").mouseup( function(event) {
      const {isFlagged, isDoubt, isBomb, isOpened} = newField[index];
      switch (event.which) {
        case 1:
          if (isFlagged == false && isDoubt == false) {
            $(".box").eq(index).children().removeClass("hide");
            if (isZero(newField[index])) {
              newField[index].isOpened = true;
              openAdiacent($(".box"), newField, newField[index].position[0], newField[index].position[1]);
            } else if (isBomb == true) {
              newArrayBombs.forEach((bomb) => {
                const {isFlagged, isDoubt, id} = bomb;
                if (isFlagged == false && isDoubt == false) {
                  $(".box").eq(id).children().removeClass("hide");
                }
              });
              timer.stop();
              $(".box").css("cursor","default");
              $(".box").children().css("cursor","default");
              $(".box").off("mouseup");
              $(".box").off("mousedown");
            }
          }
        break;
        case 3:
          if (isOpened == false && isFlagged == false && isDoubt == false && flags > 0) {
            flags -= 1;
            totFlags.text(flags);
            $(".box").eq(index).addClass("syringe");
            newField[index].isFlagged = true;
          } else if (isFlagged == true || flags == 0 && isDoubt == false){
            if (isFlagged == true) {
              flags += 1;
              totFlags.text(flags);
            }
            $(".box").eq(index).removeClass("syringe");
            $(".box").eq(index).addClass("mask");
            newField[index].isDoubt = true;
            newField[index].isFlagged = false;
          } else if (isDoubt == true) {
            $(".box").eq(index).removeClass("mask");
            newField[index].isDoubt = false;
          }
          break;
      }
      win(newField, flags, timer);
    });
  }
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
  isFlagged: false,
  isDoubt: false
};

// Non funziona su Chrome e Safari per motivi di sicurezza, perchè sto lanciando in locale
// if (typeof(Worker) !== "undefined") {
//   // Yes! Web worker support!
//   // Some code.....
// } else {
//   // Sorry! No Web Worker support..
// }
// var worker = new Worker('prova.js');
// worker.postMessage('Happy Birthday');

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
      width = 450;
      // in caso togliere la height perché lui la cambia da solo
      height = 450;
      break;
    case 1:
      gameLevel = randomInteger(0, 255);
      max = [16,16];
      bombs = 40;
      width = 800;
      height = 800;
      break;
    case 2:
      gameLevel = randomInteger(0, 479);
      max = [16,30];
      bombs = 99;
      width = 1500;
      height = 800;
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
      field[bomb].bombs = "fas fa-virus";
      field[bomb].isBomb = true;
      arraybombs.push(field[bomb]);
    }
  }
  return arraybombs;
}

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

function openAdiacent(container, array, x, y) {
  let adjArr = [];
  const arrayPosAdj = [[x-1, y-1],[x-1, y],[x-1, y+1],[x, y-1],[x, y+1],[x+1, y-1],[x+1, y],[x+1, y+1]];
  for (elem of array) {
    for (pos of arrayPosAdj) {
      if (equalArray(0, elem, pos[0], pos[1])) {
        const {isFlagged, isDoubt, id} = elem;
        adjArr.push(elem);
        if (isFlagged == false && isDoubt == false) {
          container.eq(id).css("box-shadow","none");
          container.eq(id).css("background-color","white");
          container.eq(id).children().removeClass("hide");
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

// Solo su Safari, quando non sono sulla pagina, il timer non avanza in maniera corretta, è come se si bloccasse! Su Chrome invece funziona
function timerCount() {
  if (hoursInt == 99) {
    timer.stop();
  } else {
    secondsInt++;
    if (secondsInt == 60) {
      secondsInt = 0;
      minutesInt++;
      minutes.myText(minutesInt);
    }
    if (minutesInt == 60) {
      minutesInt = 0;
      minutes.myText(minutesInt);
      hoursInt++;
      hours.myText(hoursInt);
    }
    seconds.myText(secondsInt);
  }
}

function timeReset() {
  secondsInt = 0;
  seconds.text("00");
  minutesInt = 0;
  minutes.text("00");
  hoursInt = 0;
  hours.text("00");
}

// Solo su Safari, quando non sono sulla pagina, il timer non avanza in maniera corretta, è come se si bloccasse! Su Chrome invece funziona
function Timer(func, time) {
  let obj = setInterval(func,time);

  this.stop = function() {
    clearInterval(obj);
    return this;
  }
  this.restart = function() {
    this.stop();
    timeReset();
    obj = setInterval(func,time);
    return this;
  }
}

function win(field, flags, timer) {
  if (flags == 0) {
    for (item of field) {
      const {isBomb, isFlagged} = item;
      if (isBomb == true) {
        if (isFlagged == true) {
          continue
        } else {
          return
        }
      } else {
        continue
      }
    }
    timer.stop();
    $("#winner").css("display","flex")
  }
}

$.fn.myText = function (time) {
    this.text((time >= 10) ? time : "0" + time);
};
