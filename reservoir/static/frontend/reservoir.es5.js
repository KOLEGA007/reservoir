
var PLACE_SIZE = 40;
var STATE_FREE = 0;
var STATE_RESERVED = 1;
var STATE_CONFIRMED = 2;
var TICKETS_COUNTER = document.getElementById("tickets_number");
var COLOR_ARRAY;
var TRANSPARENT;
var NORMAL_STROKE;
var levels = [];

var mouse = {
  x: undefined,
  y: undefined
};

function getColor(state) {
  if (state == undefined) return;
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
    rect(x * PLACE_SIZE, y * PLACE_SIZE, width * PLACE_SIZE, height * PLACE_SIZE);
    textFont("sans-serif");
    fill("black");
    stroke("white");
    textSize(PLACE_SIZE * 0.7);
    textAlign("center");
    text(name, (x + width / 2) * PLACE_SIZE, (y + height / 2 + 0.25) * PLACE_SIZE);
  }

  return {
    getX: function getX() {
      return x;
    },
    setX: function setX(x_c) {
      x = x_c;
    },
    getY: function getY() {
      return y;
    },
    setY: function setY(y_c) {
      y = y_c;
    },
    getName: function getName() {
      return y;
    },
    setName: function setName(name_c) {
      name = name_c;
    },
    getWidth: function getWidth() {
      return width;
    },
    setWidth: function setWidth(width_c) {
      width = width_c;
    },
    getHeight: function getHeight() {
      return height;
    },
    setHeight: function setHeight(height_c) {
      height = height_c;
    },
    render: function render() {
      _render();
    }
  };
}
function Level() {
  var active = true;
  var places = [];
  var decorations = [];

  function _getClicked() {
    for (var i = 0; i < places.length; ++i) {
      if (places[i].mouseOver()) {
        return places[i];
      };
    }
    return undefined;
  }

  function _render() {
    for (var i = 0; i < decorations.length; ++i) {
      decorations[i].render();
    }
    for (var _i = 0; _i < places.length; ++_i) {
      places[_i].render();
    }
  }

  function _getSelected() {
    var pl = [];
    for (var i = 0; i < places.length; ++i) {
      if (places[i].isSelected()) pl.push(places[i]);
    }
    return pl;
  }

  return {
    getActive: function getActive() {
      return active;
    },
    setActive: function setActive(state) {
      active = state;
    },
    addPlace: function addPlace(place) {
      places.push(place);
    },
    createPlace: function createPlace(id, x, y, state, table) {
      places.push(new Place(id, x, y, state, table));
    },
    createDecoration: function createDecoration(x, y, width, height, name) {
      decorations.push(new Decoration(x, y, width, height, name));
    },
    render: function render() {
      _render();
    },
    getClicked: function getClicked() {
      return _getClicked();
    },
    getSelected: function getSelected() {
      return _getSelected();
    }
  };
}

function Place(id, x, y, state, table) {
  var id = id;
  if (state == undefined) state = 0;
  switch (state) {
    case "reserved":
      state = STATE_RESERVED;
      break;
    case "confirmed":
      state = STATE_CONFIRMED;
      break;
    default:
      state = STATE_FREE;
  }
  var x = x;
  var y = y;
  var selected = false;
  var table = table;

  function isHovered() {
    return mouse.x > x * PLACE_SIZE && mouse.x < (x + 1) * PLACE_SIZE && mouse.y > y * PLACE_SIZE && mouse.y < (y + 1) * PLACE_SIZE;
  }

  function _render() {
    stroke("black");
    fill(getColor(state));
    rect(x * PLACE_SIZE, y * PLACE_SIZE, PLACE_SIZE, PLACE_SIZE);
    fill(color(255, 255, 255));
    if (isHovered()) {
      fill(TRANSPARENT);
      noStroke();
      rect(x * PLACE_SIZE, y * PLACE_SIZE, PLACE_SIZE, PLACE_SIZE);
      stroke(NORMAL_STROKE);
    }
    textFont("sans-serif");
    textSize(PLACE_SIZE * 0.55);
    fill("black");
    noStroke();
    text(table, x * PLACE_SIZE + PLACE_SIZE * 0.5, (y + 1) * PLACE_SIZE - PLACE_SIZE * 0.3);
    textAlign("center");
    if (selected) {
      textFont(fontawesome);
      textSize(PLACE_SIZE * 0.75);
      fill(color(0, 0, 0));
      text("\uF058", x * PLACE_SIZE + PLACE_SIZE * 0.5, (y + 1) * PLACE_SIZE - PLACE_SIZE * 0.22);
    }
  }

  return {
    getId: function getId() {
      return id;
    },
    getState: function getState() {
      return state;
    },
    setState: function setState(state_a) {
      state = state_a;
    },
    getX: function getX() {
      return x;
    },
    setX: function setX(x_c) {
      x = x_c;
    },
    getY: function getY() {
      return y;
    },
    setY: function setY(y_c) {
      y = y_c;
    },
    render: function render() {
      _render();
    },
    mouseOver: function mouseOver() {
      return isHovered();
    },
    toggleSelection: function toggleSelection() {
      if (state == STATE_FREE) selected = !selected;
    },
    isSelected: function isSelected() {
      return selected;
    },
    clearSelection: function clearSelection() {
      selected = false;
    }
  };
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
  canvas = createCanvas(16 * PLACE_SIZE, 35 * PLACE_SIZE + 1);
  canvas.parent("playground");
  COLOR_ARRAY = [color("#28a745"), color("#ffc107"), color("#dc3545")];
  TRANSPARENT = color('rgba(255, 255, 255, 0.7)');
  NORMAL_STROKE = color(0, 0, 0);
  fixCanvas();
}

function loadData(level_data) {
  level = new Level();
  places = level_data["places"];
  decorations = level_data["decorations"];
  level_label = document.querySelector("#level");
  if (level_label != undefined) level_label.innerText = level_data["level"].name;
  for (var i = 0; i < places.length; ++i) {
    place = places[i];
    level.createPlace(place.id, place.x, place.y, place.state, place.table);
  }
  for (var _i2 = 0; _i2 < decorations.length; ++_i2) {
    decoration = decorations[_i2];
    console.log(decoration);
    level.createDecoration(decoration.x, decoration.y, decoration.width, decoration.height, decoration.name);
  }
  levels.push(level);
}

function mouseClicked() {
  if ($("#shopping").hasClass("show")) return;
  var selectedPlace = level.getClicked();
  if (selectedPlace == undefined) return;
  selectedPlace.toggleSelection();
}

function draw() {
  mouse.x = mouseX;
  mouse.y = mouseY;
  for (var i = 0; i < levels.length; ++i) {
    levels[i].render();
  }
  updatePanel();
}

function updatePanel() {
  var pocet = 0;
  for (var i = 0; i < levels.length; ++i) {
    pocet += levels[i].getSelected().length;
  }
  if (pocet == 0) {
    document.getElementById("shopping_button").classList.add("disabled");
    document.getElementById("shopping_button").dataset["toggle"] = "";
  } else {
    document.getElementById("shopping_button").classList.remove("disabled");
    document.getElementById("shopping_button").dataset["toggle"] = "modal";
  }
  TICKETS_COUNTER.innerText = pocet;
}

function getSelectedPlaces() {
  var places = [];
  for (var i = 0; i < levels.length; ++i) {
    places = places.concat(levels[i].getSelected());
  }
  return places;
}

function bookSelectedPlaces() {
  var places = getSelectedPlaces();
  for (var i = 0; i < places.length; ++i) {
    places[i].setState(STATE_RESERVED);
    places[i].clearSelection();
  }
}
