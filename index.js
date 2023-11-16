import data from "./periodicTable.json" assert { type: 'json' };
import { default as wasm, Universe } from "./pkg/wasm_rust.js";

let particelsTypes = ["Carbon", "Oxygen", "Hydrogen", "Nitrogen"];

class Part {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.particelType = particelsTypes[Math.floor(Math.random() * particelsTypes.length)];

    this.element = document.createElement("div");
    this.element.style.top = posY;
    this.element.style.left = posX;
    this.element.classList.add("part");
    data.forEach(element => {
      if (element.name == this.particelType) {
        this.element.style.padding = (element.atomicRadius - data[0].atomicRadius) + "px";
        this.element.style.backgroundColor = "#" + element.cpkHexColor;
        this.elecronegativity = element.electronegativity;
        this.mass = element.atomicMass;
        this.oxidationStates = element.oxidationStates.split(", ");
        this.currOxState = this.oxidationStates[Math.floor(Math.random() * this.oxidationStates.length)];
        this.element.innerHTML = element.symbol;
      }
    });
  }

  update() {
    this.element.style.top = this.posY;
    this.element.style.left = this.posX;
  }
}

class Molecula {
  constructor(oxidationState, ...parts) {
    this.oxidationState = oxidationState;
    this.molParts = Array();
    parts.forEach(part => {
      this.molParts.push(part);
    });
  }

  add(part) {
    this.oxidationState += part.oxidationStates[0];
    this.molParts.push(part);
  }
}


wasm().then(() => {
  let canvas = document.getElementById("universe");

  let parts = new Array(300);



  for (let part = 0; part < parts.length; part++) {
    var posX = Math.floor(Math.random() * 2001);
    var posY = Math.floor(Math.random() * 2001);

    parts[part] = new Part(posX + "px", posY + "px");

    canvas.appendChild(parts[part].element);
  }

  function movePart(part, other, x, y, posX, posY) {
    var moveX = Math.floor(Universe.coulomb(x,
      part.currOxState,
      other.currOxState)
    );
    var moveY = Math.floor(Universe.coulomb(y,
      part.currOxState,
      other.currOxState)
    );
    if (moveX != 0 && moveX != Infinity) {
      if (x < 0) {
        part.posX = posX + moveX + "px";
      } else {
        part.posX = posX - moveX + "px";
      }
    }
    if (moveY != 0 && moveY != Infinity) {
      if (y > 0) {
        part.posY = posY - moveY + "px";
      } else {
        part.posY = posY + moveY + "px";
      }
    }
    part.update();
  }

  setInterval(() => {
    parts.forEach(part => {
      let posX = parseFloat(part.posX.replace("px", ""));
      let posY = parseFloat(part.posY.replace("px", ""));

      parts.forEach(other => {
        if (part != other) {
          var otherX = parseFloat(other.posX.replace("px", ""));
          var otherY = parseFloat(other.posY.replace("px", ""));

          var x = posX - otherX;
          var y = posY - otherY;

          movePart(part, other, x, y, posX, posY);

          if ((x < 50 && x > -50) || (y < 50 && y > -50)) {
            var newOxState = parseInt(part.currOxState) + parseInt(other.currOxState);
            if (part.oxidationStates.includes(newOxState)) {
              console.log(part.name + ": changed oxidation state in " + newOxState);
              part.currOxState = newOxState;
            }
          }
        }
      });
    })

  }, 30);
});
