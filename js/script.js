// ES6 aggiunge la classe, per cui si potrebbe scrivere box come classe e metterci dentro sia le proprietà che qualche funzione! Provare a pensare se può essere utilizzato VueJS!
// Mettere protezione per gli elementi undefined!
// farlo funzionare con livelli di difficoltà più alti. Per colori numeri fare come esercizio icone
// vedere se si può destrutturare

$(document).ready(function() {

  const fieldBoxes = $("#box_field");
  const box = $(".box");
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

  // creare una variabile per facile medio e difficile

  $("ul.options > li").click(function() {
    timer.restart();
    let index = $(this).index();
    let openedItem = $("ul.options > li.opened");
    openedItem.removeClass("opened");
    $(this).removeClass("hover").addClass("opened");
    // non so perchè mi mette uno spazio quando seleziono medio e difficile
    selected.children("span").html($(this).children("span").text());
    selected.toggleClass("open");
    $(".options").slideUp();
    // mettere tutto questo blocco in una funzione
    game(index);
    $("#reset").click(function() {
      timer.restart();
      game(index);
    })
  });

  // E' tutto qua dentro, cosi lui ogni volta ricrea l'evento
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

  // $(".box_item").addClass("hide");
  // $(".fas").addClass("hide");
  // avendo messo dentro game posso anche togliere l'on perchè lui ricrea tutto ogni volta (l'altra alla fine è una shorthand). Cmq le funzioni si possono anche mettere sotto, e usare event.data.param per richiamare il parametro
    $(".box").mousedown( function(event) {
      // globale, viene letto anche dal mouseup
      index = $(this).index();
      console.log(index);
      if (event.which == 1 && newField[index].isFlagged == false && newField[index].isDoubt == false) {
        newField[index].isOpened = true;
        $(this).css("box-shadow","none");
        $(this).css("background-color","white");
      }
    });

    $(".box").mouseup( function(event) {
      switch (event.which) {
        case 1:
          if (newField[index].isFlagged == false && newField[index].isDoubt == false) {
            $(".box").eq(index).children().removeClass("hide");
            if (isZero(newField[index])) {
              newField[index].isOpened = true;
              openAdiacent($(".box"), newField, newField[index].position[0], newField[index].position[1]);
            } else if (newField[index].isBomb == true) {
              newArrayBombs.forEach((bomb) => {
                if (bomb.isFlagged == false && bomb.isDoubt == false) {
                  $(".box").eq(bomb.id).children().removeClass("hide");
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
          if (newField[index].isOpened == false && newField[index].isFlagged == false && newField[index].isDoubt == false) {
            flags -= 1;
            totFlags.text(flags);
            $(".box").eq(index).addClass("syringe");
            newField[index].isFlagged = true;
            console.log(newField[index].isDoubt, index)
          } else if (newField[index].isFlagged == true){
            flags += 1;
            totFlags.text(flags);
            $(".box").eq(index).removeClass("syringe");
            $(".box").eq(index).addClass("mask");
            newField[index].isDoubt = true;
            newField[index].isFlagged = false;
            console.log(newField[index].isDoubt, index)
          } else if (newField[index].isDoubt == true) {
            $(".box").eq(index).removeClass("mask");
            newField[index].isDoubt = false;
            console.log(newField[index].isDoubt, index)
          }
          break;
      }
    });
  }
  // Tolgo il menu che si apre con il tasto destro
  $(document).on("contextmenu",function(){
    return false;
  });

  // Manca la vittoria

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
        if (elem.isFlagged == false && elem.isDoubt == false) {
          container.eq(elem.id).css("box-shadow","none");
          container.eq(elem.id).css("background-color","white");
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

function timerCount() {
  // mettere che si ferma anche col gameover, o qui o sopra!
  if (hoursInt == 99) {
    timer.stop();
  } else {
    console.log("SONO QUI")
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

$.fn.myText = function (time) {
    this.text((time >= 10) ? time : "0" + time);
};
