const PLACE_SIZE = 40;
const STATE_FREE = 0;
const STATE_RESERVED = 1;
const STATE_CONFIRMED = 2;
const TICKETS_COUNTER = document.getElementById("tickets_number");
var COLOR_ARRAY;
var TRANSPARENT;
var NORMAL_STROKE;
var levels = [];

var mouse = {
  x : undefined,
  y : undefined
};

function getColor(state)
{
  if(state == undefined)
    return;
  return COLOR_ARRAY[state];
}
function Decoration(x, y, width, height, name) {
  var name = name;
  var x = x;
  var y = y;
  var width = width;
  var height = height;

  function _render() {
    fill("white");
    stroke("black");
    rect(x*PLACE_SIZE,y*PLACE_SIZE, width*PLACE_SIZE, height*PLACE_SIZE);
    textFont("sans-serif");
    fill("black");
    stroke("white");
    textSize(PLACE_SIZE*0.7);
    textAlign("center");
    text(name, (x+width/2)*PLACE_SIZE, (y+height/2+0.25)*PLACE_SIZE);
  }

  return {
    getX : () => {return x},
    setX : (x_c) => {x = x_c},
    getY : () => {return y},
    setY : (y_c) => {y = y_c},
    getName : () => {return y},
    setName : (name_c) => {name = name_c},
    getWidth : () => {return width},
    setWidth : (width_c) => {width = width_c},
    getHeight : () => {return height},
    setHeight : (height_c) => {height = height_c},
    render : () => {_render()},
  }

}
function Level() {
  var active = true;
  var places = [];
  var decorations = [];

  function _getClicked() {
    for(let i=0; i<places.length; ++i) {
      if(places[i].mouseOver()) {return places[i]};
    }
    return undefined;
  }

  function _render() {
    for(let i=0; i<decorations.length; ++i) {
      decorations[i].render()
    }
    for(let i=0; i<places.length; ++i) {
      places[i].render()
    }
  }

  function _getSelected() {
    var pl = [];
    for(let i=0;i<places.length;++i) {
      if(places[i].isSelected()) pl.push(places[i]);
    }
    return pl;
  }

  return {
    getActive : () => {return active},
    setActive : (state) => {active = state},
    addPlace : (place) => {places.push(place)},
    createPlace : (id, x, y, state, table) => {places.push(new Place(id, x, y, state, table))},
    createDecoration : (x, y, width, height, name) => {decorations.push(new Decoration(x, y, width, height, name))},
    render : () => {_render()},
    getClicked : () => {return _getClicked()},
    getSelected : () => {return _getSelected()}
  }
}

function Place(id, x, y, state, table) {
  var id = id;
  if(state == undefined)
    state = 0;
  switch(state)
  {
    case "reserved":
      state = STATE_RESERVED;
      break;
    case "confirmed":
      state = STATE_CONFIRMED;
      break;
    default:
      state = STATE_FREE
  }
  var x = x;
  var y = y;
  var selected = false;
  var table = table;



  function isHovered() {
    return mouse.x > x*PLACE_SIZE && mouse.x < (x+1)*PLACE_SIZE &&
    mouse.y > y*PLACE_SIZE && mouse.y < (y+1)*PLACE_SIZE
  }

  function _render() {
    stroke("black");
    fill(getColor(state));
    rect(x*PLACE_SIZE,y*PLACE_SIZE, PLACE_SIZE, PLACE_SIZE);
    fill(color(255,255,255));
    if(isHovered()) {
      fill(TRANSPARENT);
      noStroke();
      rect(x*PLACE_SIZE,y*PLACE_SIZE, PLACE_SIZE, PLACE_SIZE);
      stroke(NORMAL_STROKE);
    }
    textFont("sans-serif");
    textSize(PLACE_SIZE*0.55);
    fill("black");
    noStroke();
    text(table, x*PLACE_SIZE+PLACE_SIZE*0.5, (y+1)*PLACE_SIZE-PLACE_SIZE*0.3);
    textAlign("center");
    if(selected) {
      textFont(fontawesome);
      textSize(PLACE_SIZE*0.75);
      fill(color(0,0,0));
      text("\uf058", x*PLACE_SIZE+PLACE_SIZE*0.5, (y+1)*PLACE_SIZE-PLACE_SIZE*0.22);
    }

  }

  return {
    getId : () => {return id},
    getState : () => {return state},
    setState : (state_a) => {state = state_a},
    getX : () => {return x},
    setX : (x_c) => {x = x_c},
    getY : () => {return y},
    setY : (y_c) => {y = y_c},
    render : () => {_render()},
    mouseOver : () => {return isHovered()},
    toggleSelection : () => {if(state == STATE_FREE) selected = !selected},
    isSelected : () => {return selected},
    clearSelection: () => { selected = false}
  }
}
var level;
var fontawesome;
var canvas;

function preload() {
  fontawesome = loadFont('/static/frontend/assets/FontAwesome.otf');
}

function fixCanvas() {
  canvas.resize(canvas.parent().offsetWidth, canvas.parent().offsetHeight);
}

function windowResized() {
  fixCanvas();
}

function setup() {
  canvas = createCanvas(16*PLACE_SIZE, (35*PLACE_SIZE)+1);
  canvas.parent("playground");
  COLOR_ARRAY = [color("#28a745"), color("#ffc107"), color("#dc3545")];
  TRANSPARENT = color('rgba(255, 255, 255, 0.7)');
  NORMAL_STROKE = color(0, 0, 0);
  fixCanvas();
}

function loadData(level_data)
{
  level = new Level();
  places = level_data["places"];
  decorations = level_data["decorations"];
  level_label = document.querySelector("#level");
  if(level_label != undefined)
    level_label.innerText = level_data["level"].name
  for(let i=0; i<places.length; ++i)
  {
    place = places[i];
    level.createPlace(place.id, place.x, place.y, place.state, place.table)
  }
  for(let i=0; i<decorations.length; ++i)
  {
    decoration = decorations[i];
    console.log(decoration)
    level.createDecoration(decoration.x, decoration.y, decoration.width, decoration.height, decoration.name)
  }
  levels.push(level);
}

function mouseClicked() {
  if($("#shopping").hasClass("show"))
	return;
  let selectedPlace = level.getClicked();
  if(selectedPlace == undefined)
    return;
  selectedPlace.toggleSelection();

}

function draw() {
  mouse.x = mouseX;
  mouse.y = mouseY;
  for(let i=0;i<levels.length; ++i)
  {
    levels[i].render();
  }
  updatePanel();
}

function updatePanel() {
  var pocet = 0;
  for(let i=0; i<levels.length; ++i) {
    pocet += levels[i].getSelected().length;
  }
  if(pocet == 0) {
    document.getElementById("shopping_button").classList.add("disabled")
    document.getElementById("shopping_button").dataset["toggle"] = ""
  }
  else {
    document.getElementById("shopping_button").classList.remove("disabled")
    document.getElementById("shopping_button").dataset["toggle"] = "modal"
  }
  TICKETS_COUNTER.innerText = pocet;
}

function getSelectedPlaces() {
  var places = [];
  for(let i=0;i<levels.length; ++i)
  {
    places = places.concat(levels[i].getSelected());
  }
  return places;
}

function bookSelectedPlaces() {
  let places = getSelectedPlaces();
  for(let i=0; i<places.length; ++i)
  {
    places[i].setState(STATE_RESERVED);
    places[i].clearSelection();
  }
}
