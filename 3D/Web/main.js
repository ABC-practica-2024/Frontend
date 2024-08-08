import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//import object loader - this is for importing 3D models
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(15);
camera.layers.enable(1)
camera.layers.enable(2)

function render()
{
  renderer.render(scene, camera);
}

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
ambientLight.layers.enableAll()
ambientLight.position.y=10;

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  render();
}

animate();

//we need an array of objects holding all findings for the raycasting to work (saves performance)
let objects=new Array()

fetch("Findings.txt").then(response=>response.text())
    .then(text=>{
      //do stuff with the text
      let rows=text.split("\r\n");
      let bits
      function addcube(position,rotation,size,cubecolor)
      {
        //this represents a finding
        //generate a cube with given position, rotation, scale and color
        const box=new THREE.BoxGeometry(size.x,size.y,size.z);
        const boxMaterial=new THREE.MeshStandardMaterial({color:cubecolor});
        const cube=new THREE.Mesh(box,boxMaterial);
        scene.add(cube);
        cube.position.x=position.x;
        cube.position.y=position.y;
        cube.position.z=position.z;
        cube.rotation.x=rotation.x;
        cube.rotation.y=rotation.y;
        cube.rotation.z=rotation.z;
        objects.push(cube)
      }
      for(let i=0;i<rows.length;i+=4)
      {
        bits=rows[i].split(" ")
        let pos=new THREE.Vector3(parseFloat(bits[0]),parseFloat(bits[1]),parseFloat(bits[2]))
        bits=rows[i+1].split(" ")
        let rot=new THREE.Vector3(parseFloat(bits[0]),parseFloat(bits[1]),parseFloat(bits[2]))
        bits=rows[i+2].split(" ")
        let siz=new THREE.Vector3(parseFloat(bits[0]),parseFloat(bits[1]),parseFloat(bits[2]))
        let col=new THREE.Color(rows[i+3])
        addcube(pos,rot,siz,col)
      }
    });

let o=null
document.body.onclick = function (event) {
  if (event.ctrlKey) {
    //we right clicked
    if(o===null)
    {
      //we were in the main view
      let mouse=new THREE.Vector2()
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse,camera)
      let intersects=raycaster.intersectObjects(objects)
      if(intersects.length>0)
      {
        o=intersects[0].object
        //we clicked on something, so we must hide everything else
        camera.layers.disable(0)
        camera.layers.disable(2)
        o=intersects[0].object
        o.layers.enable(1)
      }
    }
    else
    {
      if(!(o===null))
      {
        //we were in "focused" view and must switch to main view, we must reveal all hidden objects
        o.layers.disable(1)
        o=null
        camera.layers.enable(0)
        camera.layers.enable(2)
      }
    }
  }
}

//handle layers
let layers=new Array()
let currentlayer=0//int - represents the top visible layer

fetch("SiteSection.txt").then(response=>response.text())
  .then(text=>{
    //do stuff with the text
    let rows=text.split("\r\n");
    let bits
    
    //make the site section object
    bits=rows[0].split(" ")
    let siteScale=new THREE.Vector3(parseFloat(bits[0]),parseFloat(bits[1]),parseFloat(bits[2]))
    //the scale will be usfeul to us later on for the layers
    const loader=new GLTFLoader();
    loader.load( 'SiteSection.glb', function ( gltf ) {
    gltf.scene.scale.set(siteScale.x,siteScale.y,siteScale.z)
	  scene.add( gltf.scene );
    }, undefined, function ( error ) {
      console.error( error );
    });
    
    //we now need to add the archeological layers
    function addLayer(position,scale)
    {
      //generate a layer (a cube) with given position, rotation, scale and color
      const box=new THREE.BoxGeometry(scale.x*2,scale.y*2,scale.z*2);
      const boxMaterial=new THREE.MeshStandardMaterial({color:0xffffff});
      const layer=new THREE.Mesh(box,boxMaterial);
      layer.layers.disable(0)
      layer.layers.enable(2)
      scene.add(layer);
      layer.position.x=position.x;
      layer.position.y=position.y;
      layer.position.z=position.z;
      layers.push(layer)
    }
    bits=rows[1].split(" ")
    let nroflayers=parseInt(bits[0])
    let layerheight=siteScale.y/nroflayers
    let pos=new THREE.Vector3(0,siteScale.y+layerheight,0)
    let scale=new THREE.Vector3(siteScale.x,layerheight,siteScale.z)
    console.log(layerheight)
    //let col=new THREE.Color(#ff29f1)//placeholder color
    for(let i=0;i<nroflayers;i++)
    {
      //add a layer
      pos.y-=layerheight*2
      addLayer(pos,scale)
    }
  });

// add listener for keyboard
document.body.addEventListener('keydown', keyPressed, false);

function keyPressed(event){
  if(o===null)
  {
    switch(event.key) {
      case 'z':
        //make layers visible one by one moving upwards
        if(currentlayer>0)
        {
          currentlayer--
          layers[currentlayer].layers.enable(2)
        }
        break
      case 'x':
        //make layers invisible one by one moving down
        if(currentlayer<layers.length)
        {
          layers[currentlayer].layers.disable(2)
          currentlayer++
        }
        break
    }
    renderer.render(scene,camera);
  }
}
