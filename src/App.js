import React from "react";
import "./App.scss";

const textures = [];
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <header>
          <div className="title">
            Set images in canvas based on div layout
          </div>
        </header>
        <main>
          <div className="grid" data-grid-container>
            {[...Array(5)].map((x, i) => (
              <div key={i} className="grid__item" data-grid-item>
                <div className="grid__item-img" data-src={getFileUrl(i)}></div>
                <div className="grid__item-letter" data-blotter="">
                  <span>Hello</span>
                </div>
              </div>
            ))}
            <canvas id="canvas" className="canvas"></canvas>
          </div>
        </main>
      </div>
    );
  }
}

const throttleFunc = (function() {
  // Deley resize event by interval
  const interval = 350;
  let timer;

  return function() {
    clearTimeout(timer);

    const refreshScene = () => {
      const canvas = document.getElementById('canvas');
      resizeCanvas(canvas)

      setupImages()
    }

    refreshScene()

    timer = setTimeout(function() {
      refreshScene()
    }, interval);
  };
})();

window.addEventListener('resize', throttleFunc, false);

window.addEventListener("load", event => {  
  const canvas = document.querySelector('canvas');  
  const container = document.querySelector("[data-grid-container]");
  container.insertBefore(canvas, container.firstChild);
  resizeCanvas(canvas)

  loadTextures()
});

const resizeCanvas = (canvas) => {
  // const pixelRatio = window.devicePixelRatio
  const grid = document.querySelector("[data-grid-container]");
  canvas.width = grid.clientWidth;
  canvas.height = grid.clientHeight;
  
  // canvas.style.width = grid.clientWidth
  // canvas.style.height = grid.clientHeight
  // Set render size (view port size)
  
  // webGLRenderer.setSize(canvas.width * pixelRatio, canvas.height * pixelRatio);
}

const setupMouseEvent = () => {
  // NOTE: Mouse event
  const gridItems = document.querySelectorAll("[data-grid-item]");
  for (let i = 0; i < gridItems.length; i++) {
    const item = gridItems[i];

    item.addEventListener("mouseover", e => {
      // const card = planeGeometries[i];
      // card.material.uniforms.amount.value = 1.1;
      // card.material.uniforms.col_s.value = 0.3;      
      // card.material.uniforms.angle.value = 1
    });

    // item.addEventListener("mouseout", e => resetMaterial());
  }
}

const loadTextures = () => {
  const gridItems = document.querySelectorAll("[data-grid-item]");
  let counter = 0
  for (let i = 0; i < gridItems.length; i++) {
    const item = gridItems[i];
    const urlNode = item.querySelector("[data-src]");
    const url = urlNode.dataset.src;

    const img = new Image();   // Create new img element
    img.addEventListener('load', function() {
      textures[i] = img
      counter++

      if (counter === gridItems.length) {
        // NOTE: Finish all textures
        setupImages()
        setupMouseEvent()
      }
    }, false);
    img.src = url;
  }  
}

const setupImages = () => {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d');
  const gridItems = document.querySelectorAll("[data-grid-item]");

  for (let i = 0; i < gridItems.length; i++) {
    const item = gridItems[i];
    const x = item.offsetLeft;
    const y = item.offsetTop;

    const img = textures[i];    
    const width = item.clientWidth;
    const height = item.clientHeight;
    const ratio = width / height

    const sh = img.width * height / width
    const sy = (img.height - sh) / 2
    ctx.drawImage(img, 0, sy, img.width, sh, x, y, width, height);
  }
}

const getFileUrl = (index) => {
  const totalImage = 10
  const fileIndex = index % totalImage + 1

  return `./img/${fileIndex}.jpg`
}

export default App;
