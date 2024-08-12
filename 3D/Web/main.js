import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//import object loader - this is for importing 3D models
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//set up the scene
const scene = new THREE.Scene();

//set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//we can tweak this position
camera.position.setZ(25);
camera.layers.enable(1)
camera.layers.enable(2)

//set up the renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

function render()
{
  renderer.render(scene, camera);
}

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
ambientLight.layers.enableAll()
ambientLight.position.y=10;//we put the light a bit higher up, otherwise if we put an object at the origin it would block it

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  //this is sort of a main update loop
  requestAnimationFrame(animate);

  //we also need to update the controls for them to work
  controls.update();

  render();
}

animate();

//cache the texture loader
const textureLoader=new THREE.TextureLoader()
//cache the GLTF loader
const gltfLoader=new GLTFLoader()

//we need an array of objects holding all findings for the raycasting to work, otherwise we would be able to select archeological
//layers or the site section object itself
let objects=new Array()

fetch("Findings.txt").then(response=>response.text())
    .then(text=>{
      //do stuff with the text
      console.log(text)
      let rows=text.split("\n");
      console.log(rows)
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
        rows[i]=rows[i].replace("\r","")
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

//o represents the selected object, it is null when we are in the main view
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
        //we clicked on a finding, so we must hide everything else
        camera.layers.disable(0)
        camera.layers.disable(2)//we hide the archeological layers as well
        o=intersects[0].object
        o.layers.enable(1)
      }
    }
    else
    {
      if(!(o===null))
      {
        //we were in "focused" view and must switch to main view, we must reveal all hidden objects
        o.layers.disable(1)//we need to disable layer 1 for the viewed object, otherwise it would stay visible next time we enter focus view
        o=null //we set o to null to let the other functions know we are now in the main view
        camera.layers.enable(0)//make the camera see other objects in the site
        camera.layers.enable(2)//this way we can see the archeological layers which would be visible to us in main view
      }
    }
  }
}

//handle layers and the site section object
let layers=new Array()
let currentlayer=0//int - represents the top visible layer
let g=0
fetch("SiteSection.txt").then(response=>response.text())
  .then(text=>{
    let rows=text.split("\r\n");
    let bits

    let brownTexture=textureLoader.load("brown.jpg")
    let yellowTexture=textureLoader.load("yellow.jpg")
    let lightYellowTexture=textureLoader.load("lightyellow.jpg")
    let blueTexture=textureLoader.load("blue.jpg")
    let lightBlueTexture=textureLoader.load("lightblue.jpg")
    //make the site section object
    bits=rows[0].split(" ")
    let siteScale=new THREE.Vector3(parseFloat(bits[0]),parseFloat(bits[1]),parseFloat(bits[2]))
    //the scale will be useful to us later on for the layers
    gltfLoader.load( 'SiteBottom.glb', function ( gltf ) {
    gltf.scene.scale.set(siteScale.x,siteScale.y,siteScale.z)
	  scene.add( gltf.scene );
    let child=gltf.scene.children[0]
    if(child.isMesh)
    {
      child.material=new THREE.MeshStandardMaterial({map:brownTexture})
    }
    }, undefined, function ( error ) {
      console.error( error );
    });

    //we now need to add the archeological layers
    function addLayer(position,scale,layerTexture,stripTexture)
    {
      //generate a layer with a given position, rotation, scale and color (WIP)
      gltfLoader.load('Layer.glb', function ( gltf ) {
        gltf.scene.scale.set(scale.x,scale.y,scale.z)
        gltf.scene.position.x=position.x
        gltf.scene.position.y=position.y
        gltf.scene.position.z=position.z
        scene.add(gltf.scene);
        //we need to change the children's material and layers
        let child=gltf.scene.children[0]
        if(child.isMesh)
        {
          child.material=new THREE.MeshStandardMaterial({map:layerTexture})
        }
        child.layers.disable(0)
        child.layers.enable(2)
        layers.push(gltf.scene)
        }, undefined, function ( error ) {
          console.error( error );
        });
      //generate a layer strip
      gltfLoader.load( 'LayerStrip.glb', function ( gltf ) {
        gltf.scene.scale.set(scale.x,scale.y,scale.z)
        gltf.scene.position.x=position.x
        gltf.scene.position.y=position.y
        gltf.scene.position.z=position.z
        scene.add( gltf.scene );
        let child=gltf.scene.children[0]
        if(child.isMesh)
        {
          child.material=new THREE.MeshStandardMaterial({map:stripTexture})
        }
        }, undefined, function ( error ) {
          console.error( error );
        });
    }
    bits=rows[1].split(" ")
    let nroflayers=parseInt(bits[0])
    let layerheight=siteScale.y/nroflayers
    let scale=new THREE.Vector3(siteScale.x,layerheight,siteScale.z)
    //console.log(layerheight)
    //let col=new THREE.Color(#ff29f1)//placeholder color
    for(let i=0;i<nroflayers;i++)
    {
      //add a layer
      let pos=new THREE.Vector3(0,siteScale.y-((i+1)*2-1)*layerheight,0)
      if(g%2==0)
      {
        addLayer(pos,scale,yellowTexture,lightYellowTexture)
      }
      else
      {
        addLayer(pos,scale,blueTexture,lightBlueTexture)
      }
      g++
    }
  });

// add listener for key press events
document.body.addEventListener('keydown', keyPressed, false);

function keyPressed(event){
  if(o===null)
  {
    //we are currently in the main view
    //we only want to interact with layers in the main view, not in focus view
    switch(event.key) {
      case 'z':
        //make layers visible one by one moving upwards
        if(currentlayer>0)
        {
          currentlayer--
          layers[currentlayer].traverse( function( object ) {
            object.layers.enable(2)
          });
        }
        break
      case 'x':
        //make layers invisible one by one moving down
        if(currentlayer<layers.length)
        {
          //layers only have layer 2, so by disabling this layer we hide them from the camera
          layers[currentlayer].traverse( function( object ) {
            object.layers.disable(2)
          });
          currentlayer++
        }
        break
    }
    //we need to rerender everytime we make a change
    render();
  }
}
