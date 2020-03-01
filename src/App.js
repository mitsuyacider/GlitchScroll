import React from "react";
import "./App.scss";
// import "threelib/postprocessing/EffectComposer";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

// import "threelib/postprocessing/RenderPass";
import "threelib/postprocessing/ShaderPass";
import "threelib/postprocessing/DigitalGlitch";
import "threelib/shaders/RGBShiftShader";
import "threelib/shaders/CopyShader";

// import "threelib/OBJMTLLoader";

const THREE = require("three");
const webGLRenderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const textures = [];

let imageList = [];
let renderPass = {};
let glitchPass = new GlitchPass();

function App() {
  const fileUrlList = [];
  for (let i = 1; i < 5; i++) {
    const url = `./img/${i}.jpg`;
    fileUrlList.push(url);
  }

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
              <div className="grid__item-img" data-src={fileUrlList[i]}></div>
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

const throttleFunc = (function() {
  // 停止させたい時間
  const interval = 350;
  let timer;

  return function() {
    glitchPass.enabled = true;
    clearTimeout(timer);

    timer = setTimeout(function() {
      const canvas = webGLRenderer.domElement;
      resizeCanvas(canvas)
    
      const camera = createSceneCamera(canvas)    
      renderPass.camera = camera;
    
      // NOTE: 前回のplaneをsceneから外す
      imageList.map(card => scene.remove(card));
      imageList = [];
      setupImages()

      glitchPass.enabled = false;
    }, interval);
  };
})();

const resizeCanvas = (canvas) => {
  const pixelRatio = window.devicePixelRatio
  const grid = document.querySelector("[data-grid-container]");
  canvas.width = grid.clientWidth;
  canvas.height = grid.clientHeight;
  canvas.style.width = `${grid.clientWidth}px`;
  canvas.style.height = `${grid.clientHeight}px`;

  // Set render size (view port size)
  webGLRenderer.setSize(canvas.width * pixelRatio, canvas.height * pixelRatio);
}

window.addEventListener('resize', throttleFunc, false);

window.addEventListener("load", event => {
  // NOTE: Canvas サイズを指定
  const canvas = webGLRenderer.domElement;  
  canvas.classList.add("canvas");

  resizeCanvas(canvas)

  const container = document.getElementById("WebGL-output");
  container.insertBefore(canvas, container.firstChild);

  // create a camera, which defines where we're looking at.
  const camera = createSceneCamera(canvas)

  // NOTE: Add right in order to show rendering images
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.castShadow = true;
  spotLight.position.set(0, 60, 50);
  spotLight.intensity = 1;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.camera.fov = 120;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 1000;

  const ambiLight = new THREE.AmbientLight(0x444444);
  scene.add(ambiLight);
  scene.add(spotLight);


  glitchPass.enabled = false;
  glitchPass.goWild = true;

  const effectCopy = new ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;

  renderPass = new RenderPass(scene, camera);

  // NOTE: Load texture
  const gridItems = document.querySelectorAll("[data-grid-item]");
  let counter = 0
  for (let i = 0; i < gridItems.length; i++) {
    const item = gridItems[i];
    const urlNode = item.querySelector("[data-src]");
    const url = urlNode.dataset.src;

    const loader = new THREE.TextureLoader();
    loader.load(
      url,          
      function complete(texture) {
        textures[i] = texture
        counter++

        if (counter === gridItems.length) {
          // NOTE: Finish all textures
          setupImages()
          setupMouseEvent()
        }
      },
      undefined,
      function error( err ) { console.error( 'An error happened.' )}
    );
  }

  // NOTE: Posteffect applied on resize
  const composer = new EffectComposer(webGLRenderer);
  composer.addPass(renderPass);
  composer.addPass(glitchPass);
  composer.addPass(effectCopy);

  render();

  function render() {
    requestAnimationFrame(render);
    composer.render();
    // webGLRenderer.render(scene, camera);
  }
});

function createSceneCamera(canvas) {
  const camera = new THREE.OrthographicCamera(
    -canvas.width,
    canvas.width,
    canvas.height,
    -canvas.height,
    0,
    1
  );

  // position and point the camera to the center of the scene
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 1;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  return camera
}

function setupMouseEvent() {
  // NOTE: Mouse event
  const gridItems = document.querySelectorAll("[data-grid-item]");
  for (let i = 0; i < gridItems.length; i++) {
    const item = gridItems[i];

    item.addEventListener("mouseover", e => {
      const card = imageList[i];
      card.material.uniforms.amount.value = 1.1;
    });

    item.addEventListener("mouseout", e => resetMaterial());
  }
}

function setupImages() {
  const canvas = webGLRenderer.domElement;
  const gridItems = document.querySelectorAll("[data-grid-item]");

  const originalMaterial = new THREE.ShaderMaterial({
    uniforms: THREE.DigitalGlitch.uniforms,
    vertexShader: THREE.DigitalGlitch.vertexShader,
    fragmentShader: THREE.DigitalGlitch.fragmentShader
  });

  for (let i = 0; i < gridItems.length; i++) {
    const item = gridItems[i];
    const x = item.offsetLeft;
    const y = item.offsetTop;

    const cardTexture = textures[i];
    const width = item.clientWidth;
    const height = item.clientHeight;

    const cardGeometry = new THREE.PlaneGeometry(width * 2, height * 2, 0, 0);

    const material = originalMaterial.clone();
    material.uniforms = THREE.UniformsUtils.clone(originalMaterial.uniforms);
    material.needsUpdate = true;
    material.uniforms.tDiffuse.value = cardTexture;
    material.uniforms.tDisp.value = cardTexture;

    const card = new THREE.Mesh(cardGeometry, material);

    // NOTE: まずは原点移動
    card.position.x = (-canvas.width / 2) * 2 + (width / 2) * 2;
    card.position.y = (canvas.height / 2) * 2 - (height / 2) * 2;

    card.position.x += x * 2;
    card.position.y -= y * 2;

    scene.add(card);
    imageList.push(card);
  }

  resetMaterial();
}

function resetMaterial() {
  imageList.map(card => {
    const material = card.material;
    material.uniforms.byp.value = 0;
    material.uniforms.amount.value = 0;
    material.uniforms.angle.value = 0;
    material.uniforms.seed.value = 0;
    material.uniforms.seed_x.value = 0;
    material.uniforms.seed_y.value = 0;
    material.uniforms.distortion_x.value = 0;
    material.uniforms.distortion_y.value = 0;
    material.uniforms.col_s.value = 0;
  });
}

export default App;
