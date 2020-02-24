import React from "react";
import "./App.scss";
// import "threelib/postprocessing/EffectComposer";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

// import "threelib/postprocessing/RenderPass";
import "threelib/postprocessing/ShaderPass";

import "threelib/shaders/RGBShiftShader";
import "threelib/shaders/CopyShader";

// import "threelib/OBJMTLLoader";

const THREE = require("three");
const imageUrl = require(`./img/3.jpg`);

const imageList = [];

function App() {
  return (
    <div className="App">
      {/* <div id="WebGL-output"></div> */}
      <main>
        <div className="frame">
          <div className="frame__title-wrap">
            <h1 className="frame__title">
              Text Distortion Effects using{" "}
              <a href="https://blotter.js.org/">Blotter.js</a>
            </h1>
            <p className="frame__tagline">
              The scroll speed determines the distortion
            </p>
          </div>
          <a
            className="frame__github"
            href="https://github.com/codrops/TextDistortionEffects/"
          >
            GitHub
          </a>
          <div className="frame__links">
            <a href="https://tympanus.net/Tutorials/CustomCursors/">
              Previous Demo
            </a>
            <a href="https://tympanus.net/codrops/?p=38200">Article</a>
          </div>
          <div className="frame__demos">
            <a href="index.html" className="frame__demo frame__demo--current">
              demo 1
            </a>
            <a href="index2.html" className="frame__demo">
              demo 2
            </a>
          </div>
        </div>

        <div className="grid" data-grid-container id="WebGL-output">
          {[...Array(4)].map((x, i) => (
            <div key={i} className="grid__item" data-grid-item>
              <div
                className="grid__item-img"
                // style={{ backgroundImage: `url(${imageUrl})` }}
                style={{ background: `yellow`, opacity: 0.5 }}
                data-src={imageUrl}
              ></div>
              <div className="grid__item-letter" data-blotter="">
                <canvas
                  className="b-canvas"
                  width="676"
                  height="550"
                  style={{ width: "338px", height: "275px" }}
                >
                  A9
                </canvas>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// window.addEventListener("resize", event => {
//   const grid = document.querySelector("[data-grid-container]");
//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");

//   canvas.width = grid.clientWidth;
//   canvas.height = grid.clientHeight;
//   canvas.style.width = `${grid.clientWidth}px`;
//   canvas.style.height = `${grid.clientHeight}px`;

//   // NOTE: 画像を配置する
//   const gridItems = document.querySelectorAll("[data-grid-item]");
//   const item = gridItems[0];

//   for (let i = 0; i < gridItems.length; i++) {
//     const item = gridItems[i];
//     const x = item.offsetLeft;
//     const y = item.offsetTop;

//     const img = imageList[i];
//     const width = item.clientWidth;
//     const height = item.clientHeight;
//     ctx.drawImage(img, x, y, width, height);
//   }
// });

window.addEventListener("load", event => {
  // NOTE: Canvas サイズを指定
  const grid = document.querySelector("[data-grid-container]");
  var webGLRenderer = new THREE.WebGLRenderer();

  const canvas = webGLRenderer.domElement;
  canvas.classList.add("canvas");
  canvas.width = grid.clientWidth;
  canvas.height = grid.clientHeight;
  canvas.style.width = `${grid.clientWidth}px`;
  canvas.style.height = `${grid.clientHeight}px`;
  document.getElementById("WebGL-output").appendChild(canvas);

  var scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  // var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  var camera = new THREE.OrthographicCamera(
    -canvas.width,
    canvas.width,
    canvas.height,
    -canvas.height,
    0,
    1
  );

  // create a render and set the size
  webGLRenderer.setClearColor(new THREE.Color(0xaaaaff, 1.0));
  webGLRenderer.setSize(canvas.width, canvas.height);
  webGLRenderer.shadowMapEnabled = true;

  // position and point the camera to the center of the scene
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 1;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.castShadow = true;
  spotLight.position.set(0, 60, 50);
  spotLight.intensity = 1;
  spotLight.shadowMapWidth = 2048;
  spotLight.shadowMapHeight = 2048;
  spotLight.shadowCameraFov = 120;
  spotLight.shadowCameraNear = 1;
  spotLight.shadowCameraFar = 1000;

  var ambiLight = new THREE.AmbientLight(0x444444);
  scene.add(ambiLight);

  scene.add(spotLight);

  // NOTE: 画像を配置する
  const gridItems = document.querySelectorAll("[data-grid-item]");

  for (let i = 0; i < gridItems.length; i++) {
    const item = gridItems[i];
    const x = item.offsetLeft;
    const y = item.offsetTop;

    const urlNode = item.querySelector("[data-src]");
    const url = urlNode.dataset.src;
    const cardTexture = THREE.ImageUtils.loadTexture(url);
    const width = item.clientWidth;
    const height = item.clientHeight;
    const cardGeometry = new THREE.PlaneGeometry(width * 2, height * 2, 0, 0);
    const material = new THREE.MeshLambertMaterial({ map: cardTexture });
    const card = new THREE.Mesh(cardGeometry, material);

    // NOTE: まずは原点移動
    card.position.x = (-canvas.width / 2) * 2 + (width / 2) * 2;
    card.position.y = (canvas.height / 2) * 2 - (height / 2) * 2;

    card.position.x += x * 2;
    card.position.y -= y * 2;

    scene.add(card);

    imageList.push(card);
  }

  var rgbShift = new ShaderPass(THREE.RGBShiftShader);
  rgbShift.enabled = false;

  var renderPass = new RenderPass(scene, camera);

  var glitchPass = new GlitchPass();
  glitchPass.enabled = false;

  var effectCopy = new ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;

  var composer = new EffectComposer(webGLRenderer);
  composer.addPass(renderPass);
  composer.addPass(glitchPass);
  composer.addPass(rgbShift);
  composer.addPass(effectCopy);

  render();

  function render() {
    requestAnimationFrame(render);
    composer.render();

    // rgbShift.uniforms.amount.value += 0.001;
    // rgbShift.uniforms.angle.value += 0.001;
  }
});

export default App;
