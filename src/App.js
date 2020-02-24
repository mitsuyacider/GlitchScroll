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

        <canvas id="canvas"></canvas>

        <div className="grid" data-grid-container id="WebGL-output">
          {[...Array(3)].map((x, i) => (
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

window.addEventListener("resize", event => {
  const grid = document.querySelector("[data-grid-container]");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = grid.clientWidth;
  canvas.height = grid.clientHeight;
  canvas.style.width = `${grid.clientWidth}px`;
  canvas.style.height = `${grid.clientHeight}px`;

  // NOTE: 画像を配置する
  const gridItems = document.querySelectorAll("[data-grid-item]");
  const item = gridItems[0];

  for (let i = 0; i < gridItems.length; i++) {
    const item = gridItems[i];
    const x = item.offsetLeft;
    const y = item.offsetTop;

    const img = imageList[i];
    const width = item.clientWidth;
    const height = item.clientHeight;
    ctx.drawImage(img, x, y, width, height);
  }
});

window.addEventListener("load", event => {
  // NOTE: Canvas サイズを指定
  const grid = document.querySelector("[data-grid-container]");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = grid.clientWidth;
  canvas.height = grid.clientHeight;
  canvas.style.width = `${grid.clientWidth}px`;
  canvas.style.height = `${grid.clientHeight}px`;

  // NOTE: 画像を配置する
  const gridItems = document.querySelectorAll("[data-grid-item]");
  for (let i = 0; i < gridItems.length; i++) {
    const item = gridItems[i];
    const x = item.offsetLeft;
    const y = item.offsetTop;

    const img = new Image();
    const urlNode = item.querySelector("[data-src]");
    const url = urlNode.dataset.src;
    const width = item.clientWidth;
    const height = item.clientHeight;

    img.onload = function() {
      ctx.drawImage(img, x, y, width, height);
    };
    img.src = url;

    imageList.push(img);
  }

  var scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // create a render and set the size
  var webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(new THREE.Color(0xaaaaff, 1.0));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMapEnabled = true;

  // position and point the camera to the center of the scene
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 40;
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

  // var cube1 = new THREE.Mesh(
  //   new THREE.BoxGeometry(30, 10, 2),
  //   new THREE.MeshPhongMaterial({ color: 0xff0000 })
  // );
  // cube1.position.x = -15;
  // cube1.position.y = 5;
  // cube1.position.z = 15;
  // cube1.castShadow = true;
  // scene.add(cube1);

  // var cube2 = cube1.clone();
  // cube2.material = cube1.material.clone();
  // cube2.material.color = new THREE.Color(0x00ff00);
  // cube2.position.z = 5;
  // cube2.position.x = -20;
  // scene.add(cube2);

  // var cube3 = cube1.clone();
  // cube3.material = cube1.material.clone();
  // cube3.material.color = new THREE.Color(0x0000ff);
  // cube3.position.z = -8;
  // cube3.position.x = -25;
  // scene.add(cube3);

  var cardTexture = THREE.ImageUtils.loadTexture('./img/3.jpg');
  var cardGeometry = new THREE.PlaneGeometry(16, 25, 0, 0);
  var material = new THREE.MeshLambertMaterial({ map : cardTexture });

  var card = new THREE.Mesh(cardGeometry, material);
  scene.add(card);

  // var mesh;

  // add the output of the renderer to the html element
  const glCanvas = webGLRenderer.domElement
  glCanvas.classList.add("canvas")
  document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

  var rgbShift = new ShaderPass(THREE.RGBShiftShader);
  rgbShift.enabled = true;

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
