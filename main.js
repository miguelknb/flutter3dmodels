import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

const getParameterByName = (name, url = window.location.href) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

class LoadModelDemo {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this._threejs.setClearColor(0xa6a6a6, 1);

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(75, 20, 0);

    this._scene = new THREE.Scene();
    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(10, -10, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    light = new THREE.AmbientLight(0xFFFFFF, 0.5);
    this._scene.add(light);

    let light2 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light2.position.set(10, 10, -10);
    light2.target.position.set(0, 0, 0);
    light2.castShadow = true;
    light2.shadow.bias = -0.001;
    light2.shadow.mapSize.width = 2048;
    light2.shadow.mapSize.height = 2048;
    light2.shadow.camera.near = 0.1;
    light2.shadow.camera.far = 500.0;
    light2.shadow.camera.near = 0.5;
    light2.shadow.camera.far = 500.0;
    light2.shadow.camera.left = 100;
    light2.shadow.camera.right = -100;
    light2.shadow.camera.top = 100;
    light2.shadow.camera.bottom = -100;
    this._scene.add(light2);


    const controls = new OrbitControls(
      this._camera, this._threejs.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    this._mixers = [];
    this._previousRAF = null;

    this._LoadModel()
    this._RAF();
  }

  _LoadModel() {
    let modelName = getParameterByName('model'); 
    const loader = new GLTFLoader();
    loader.load(`./models/${modelName}/scene.gltf`, (gltf) => {
      switch(modelName) {
        case "ramen" : { gltf.scene.scale.set(120,120,120); break };
        case "truck" : { gltf.scene.scale.set(10, 10, 10); break };
        case "fridge" : { gltf.scene.scale.set(30,30,30); break };
        case "bike" : { gltf.scene.scale.set(0.5,0.5,0.5); break };
        case "backpack" : { gltf.scene.scale.set(50,50,50); break };
        case "gramophone" : { gltf.scene.scale.set(50,50,50); break };
        case "axe" : { gltf.scene.scale.set(60,60,60); break };
        case "penguin" : { gltf.scene.scale.set(5,5,5); break };
        case "chair" : { gltf.scene.scale.set(40, 40, 40); break };
        case "plate" : { gltf.scene.scale.set(140,140,140); break };
        case "guarana" : { gltf.scene.scale.set(1, 1, 1); break };
        case "knight" : { gltf.scene.scale.set(30,30,30); break };
        default: { gltf.scene.scale.set(10, 10, 10); break };
      } 
      this._scene.add(gltf.scene);
    });
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (this._mixers) {
      this._mixers.map(m => m.update(timeElapsedS));
    }
  }
}


let _APP = null;


window.addEventListener('DOMContentLoaded', () => {
  _APP = new LoadModelDemo();
  _APP._OnWindowResize();
});