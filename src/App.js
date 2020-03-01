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

let planeGeometries = [];
let renderPass = {};
let glitchPass = new GlitchPass();


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <main>
          <div className="grid" data-grid-container id="WebGL-output">
            {[...Array(5)].map((x, i) => (
              <div key={i} className="grid__item" data-grid-item>
                <div className="grid__item-img" data-src={getFileUrl(i)}></div>
                <div className="grid__item-letter" data-blotter="">
                  <span>Hello</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }
}

const throttleFunc = (function() {
  // 停止させたい時間
  const interval = 350;
  let timer;

  return function() {
    glitchPass.enabled = true;
    clearTimeout(timer);

    const refreshScene = () => {
      const canvas = webGLRenderer.domElement;
      resizeCanvas(canvas)

      const camera = createSceneCamera(canvas)

      // NOTE: 前回のplaneをsceneから外す
      planeGeometries.map(card => scene.remove(card));
      planeGeometries = [];
      setupImages()

      renderPass.camera = camera;
      renderPass.scene = scene
    }

    refreshScene()

    timer = setTimeout(function() {
      refreshScene()
      glitchPass.enabled = false;
    }, interval);
  };
})();

window.addEventListener('resize', throttleFunc, false);

window.addEventListener("load", event => {
  // NOTE: Canvas サイズを指定
  const canvas = webGLRenderer.domElement;  
  canvas.classList.add("canvas");

  const container = document.getElementById("WebGL-output");
  container.insertBefore(canvas, container.firstChild);
  resizeCanvas(canvas)

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

  // NOTE: Load texture
  loadTextures()

  // NOTE: Render images. If you want to cancel rendering, call returned function
  const cancel = render(scene, camera);
  // cancel()
});

const render = (scene, camera) => {

  // NOTE: Posteffect applied on resize
  glitchPass.enabled = false;
  glitchPass.goWild = true;

  const effectCopy = new ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;

  renderPass = new RenderPass(scene, camera);

  const composer = new EffectComposer(webGLRenderer);
  composer.addPass(renderPass);
  composer.addPass(glitchPass);
  composer.addPass(effectCopy);

  let animationId
  
  function _render() {
    animationId = requestAnimationFrame(_render);
    composer.render();
    // webGLRenderer.render(scene, camera);
  }

  _render()

  // NOTE: Stop rendering
  return () => {
    cancelAnimationFrame(animationId)
  }
}

const resizeCanvas = (canvas) => {
  const pixelRatio = window.devicePixelRatio
  const grid = document.querySelector("[data-grid-container]");
  canvas.width = grid.clientWidth;
  canvas.height = grid.clientHeight;
  
  // Set render size (view port size)
  webGLRenderer.setSize(canvas.width * pixelRatio, canvas.height * pixelRatio);
}

const setupMouseEvent = () => {
  // NOTE: Mouse event
  const gridItems = document.querySelectorAll("[data-grid-item]");
  for (let i = 0; i < gridItems.length; i++) {
    const item = gridItems[i];

    item.addEventListener("mouseover", e => {
      const card = planeGeometries[i];
      card.material.uniforms.amount.value = 1.1;
      card.material.uniforms.col_s.value = 0.3;      
      // card.material.uniforms.angle.value = 1
    });

    item.addEventListener("mouseout", e => resetMaterial());
  }
}

const originalMaterial = new THREE.ShaderMaterial({
  uniforms: THREE.DigitalGlitch.uniforms,
  vertexShader: THREE.DigitalGlitch.vertexShader,
  fragmentShader: THREE.DigitalGlitch.fragmentShader
});

const setupImages = () => {
  const canvas = webGLRenderer.domElement;
  const gridItems = document.querySelectorAll("[data-grid-item]");

  for (let i = 0; i < gridItems.length; i++) {
    const item = gridItems[i];
    const x = item.offsetLeft;
    const y = item.offsetTop;

    const cardTexture = textures[i];
    
    const width = item.clientWidth;
    const height = item.clientHeight;

    // NOTE: Setup material
    const material = originalMaterial.clone();
    material.uniforms.tDiffuse.value = cardTexture;
    material.uniforms.tDisp.value = cardTexture;

    // NOTE: Create a plane geometry to put image on it
    const cardGeometry = new THREE.PlaneGeometry(width * 2, height * 2, 0, 0);
    const card = new THREE.Mesh(cardGeometry, material);

    // NOTE: Go to origin
    card.position.x = (-canvas.width / 2) * 2 + (width / 2) * 2;
    card.position.y = (canvas.height / 2) * 2 - (height / 2) * 2;

    // NOTE: Move to exact position
    card.position.x += x * 2;
    card.position.y -= y * 2;

    scene.add(card);
    planeGeometries.push(card);
  }

  resetMaterial();
}

const createSceneCamera = (canvas) => {
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

const resetMaterial = () => {
  planeGeometries.map(card => {
    const material = card.material;
    material.uniforms.byp.value = 0;
    material.uniforms.amount.value = 0.0;
    material.uniforms.angle.value = 0;
    material.uniforms.seed.value = 0;
    material.uniforms.seed_x.value = 0;
    material.uniforms.seed_y.value = 0;
    material.uniforms.distortion_x.value = 0;
    material.uniforms.distortion_y.value = 0;
    material.uniforms.col_s.value = 0;
  });
}

const loadTextures = () => {
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
}

const getFileUrl = (index) => {
  const totalImage = 10
  const fileIndex = index % totalImage + 1

  return `./img/${fileIndex}.jpg`
}

export default App;
