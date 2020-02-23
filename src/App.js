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

function App() {
  return (
    <div className="App">
      <div id="WebGL-output"></div>
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

        <div className="grid">
          <div className="grid__item">
            {" "}
            <div
              className="grid__item-img"
              style={{ backgroundImage: `url(${imageUrl})` }}
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
          <div className="grid__item">
            <div
              className="grid__item-img"
              style={{ backgroundImage: "url(img/3.jpg)" }}
            ></div>
            <div className="grid__item-letter" data-blotter="">
              <canvas
                className="b-canvas"
                width="686"
                height="550"
                style={{ width: "343px", height: "275px" }}
              >
                R4
              </canvas>
            </div>
          </div>
          <div className="grid__item">
            <div
              className="grid__item-img"
              style={{ backgroundImage: "url(img/4.jpg)" }}
            ></div>
            <div className="grid__item-letter" data-blotter="">
              <canvas
                className="b-canvas"
                width="656"
                height="550"
                style={{ width: "328px", height: "275px" }}
              >
                B7
              </canvas>
            </div>
          </div>
          <div className="grid__item">
            <div
              className="grid__item-img"
              style={{ backgroundImage: "url(img/8.jpg)" }}
            ></div>
            <div className="grid__item-letter" data-blotter="">
              <canvas
                className="b-canvas"
                width="674"
                height="550"
                style={{ width: "337px", height: "275px" }}
              >
                K3
              </canvas>
            </div>
          </div>
          <div className="grid__item">
            <div
              className="grid__item-img"
              style={{ backgroundImage: "url(img/5.jpg)" }}
            ></div>
            <div className="grid__item-letter" data-blotter="">
              <canvas
                className="b-canvas"
                width="636"
                height="550"
                style={{ width: "318px", height: "275px" }}
              >
                T2
              </canvas>
            </div>
          </div>
          <div className="grid__item">
            <div
              className="grid__item-img"
              style={{ backgroundImage: "url(img/6.jpg)" }}
            ></div>
            <div className="grid__item-letter" data-blotter="">
              <canvas
                className="b-canvas"
                width="678"
                height="550"
                style={{ width: "339px", height: "275px" }}
              >
                H8
              </canvas>
            </div>
          </div>
          <div className="grid__item">
            <div
              className="grid__item-img"
              style={{ backgroundImage: "url(img/10.jpg)" }}
            ></div>
            <div className="grid__item-letter" data-blotter="">
              <canvas
                className="b-canvas"
                width="674"
                height="550"
                style={{ width: "337px", height: "275px" }}
              >
                X5
              </canvas>
            </div>
          </div>
          <div className="grid__item">
            <div
              className="grid__item-img"
              style={{ backgroundImage: "url(img/1.jpg)" }}
            ></div>
            <div className="grid__item-letter" data-blotter="">
              <canvas
                className="b-canvas"
                width="674"
                height="550"
                style={{ width: "337px", height: "275px" }}
              >
                A6
              </canvas>
            </div>
          </div>
          <div className="grid__item">
            <div
              className="grid__item-img"
              style={{ backgroundImage: "url(img/9.jpg)" }}
            ></div>
            <div className="grid__item-letter" data-blotter="">
              <canvas
                className="b-canvas"
                width="648"
                height="550"
                style={{ width: "324px", height: "275px" }}
              >
                S2
              </canvas>
            </div>
          </div>
          <div className="grid__item">
            <div
              className="grid__item-img"
              style={{ backgroundImage: "url(img/7.jpg)" }}
            ></div>
            <div className="grid__item-letter" data-blotter="">
              <canvas
                className="b-canvas"
                width="748"
                height="550"
                style={{ width: "374px", height: "275px" }}
              >
                W4
              </canvas>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

window.addEventListener("load", event => {
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

  //        // position and point the camera to the center of the scene
  camera.position.x = 20;
  camera.position.y = 30;
  camera.position.z = 40;
  camera.lookAt(new THREE.Vector3(-15, -10, -25));

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
  // var plane = new THREE.BoxGeometry(1600, 1600, 0.1, 40, 40);
  // var cube = new THREE.Mesh(
  //   plane,
  //   new THREE.MeshPhongMaterial({
  //     color: 0xffffff,
  //     map: THREE.ImageUtils.loadTexture(
  //       "./assets/textures/general/plaster-diffuse.jpg"
  //     ),
  //     normalMap: THREE.ImageUtils.loadTexture(
  //       "./assets/textures/general/plaster-normal.jpg"
  //     ),
  //     normalScale: new THREE.Vector2(0.6, 0.6)
  //   })
  // );

  // cube.material.map.wrapS = THREE.RepeatWrapping;
  // cube.material.map.wrapT = THREE.RepeatWrapping;
  // cube.material.normalMap.wrapS = THREE.RepeatWrapping;
  // cube.material.normalMap.wrapT = THREE.RepeatWrapping;
  // cube.rotation.x = Math.PI / 2;
  // cube.material.map.repeat.set(80, 80);

  // cube.receiveShadow = true;
  // cube.position.z = -150;
  // cube.position.x = -150;
  // scene.add(cube);

  var cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(30, 10, 2),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
  );
  cube1.position.x = -15;
  cube1.position.y = 5;
  cube1.position.z = 15;
  cube1.castShadow = true;
  scene.add(cube1);

  var cube2 = cube1.clone();
  cube2.material = cube1.material.clone();
  cube2.material.color = new THREE.Color(0x00ff00);
  cube2.position.z = 5;
  cube2.position.x = -20;
  scene.add(cube2);

  var cube3 = cube1.clone();
  cube3.material = cube1.material.clone();
  cube3.material.color = new THREE.Color(0x0000ff);
  cube3.position.z = -8;
  cube3.position.x = -25;
  scene.add(cube3);

  // var mesh;

  // add the output of the renderer to the html element

  document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

  var rgbShift = new ShaderPass(THREE.RGBShiftShader);
  rgbShift.enabled = true;

  // var renderPass = new THREE.RenderPass(scene, camera);
  var renderPass = new RenderPass(scene, camera);

  var glitchPass = new GlitchPass();

  var effectCopy = new ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;

  var composer = new EffectComposer(webGLRenderer);
  composer.addPass(renderPass);
  // composer.addPass(glitchPass);
  composer.addPass(rgbShift);
  composer.addPass(effectCopy);

  render();

  function render() {
    requestAnimationFrame(render);
    // webGLRenderer.render(scene, camera);
    composer.render();
  }
});

export default App;
