import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//import object loader - this is for importing 3D models
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
//import textures
import brown from "../assets/images/textures/brown.jpg";
import blue from "../assets/images/textures/blue.jpg";
import lightblue from "../assets/images/textures/lightblue.jpg";
import yellow from "../assets/images/textures/yellow.jpg";
import lightyellow from "../assets/images/textures/lightyellow.jpg";

//set up the scene
const scene = new THREE.Scene();

//set up the camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
//we can tweak this position in the future
camera.position.setZ(25);
camera.layers.enable(1);
camera.layers.enable(2);

//set up the renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

function render() {
    renderer.render(scene, camera);
}

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);
ambientLight.layers.enableAll();
ambientLight.position.y = 10; //we put the light a bit higher up, otherwise if we put an object at the origin it would block it

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
const textureLoader = new THREE.TextureLoader();
//cache the GLTF loader
const gltfLoader = new GLTFLoader();

//we need an array of objects holding all findings for the raycasting to work, otherwise we would be able to select archeological
//layers or the site section object itself
let objects = new Array();

fetch("../Data/Findings.json")
    .then((response) => response.json())
    .then((data) => {
        function addcube(position, rotation, size, cubecolor) {
            //this represents a finding
            //generate a cube with given position, rotation, scale and color
            const box = new THREE.BoxGeometry(size.x, size.y, size.z);
            const boxMaterial = new THREE.MeshStandardMaterial({
                color: cubecolor,
            });
            const cube = new THREE.Mesh(box, boxMaterial);
            scene.add(cube);
            cube.position.set(position.x, position.y, position.z);
            cube.rotation.set(rotation.x, rotation.y, rotation.z);
            objects.push(cube);
        }
        for (let i = 0; i < data.findings.length; i++) {
            let pos = new THREE.Vector3(
                data.findings[i].position[0],
                data.findings[i].position[1],
                data.findings[i].position[2]
            );
            let rot = new THREE.Vector3(
                data.findings[i].rotation[0],
                data.findings[i].rotation[1],
                data.findings[i].rotation[2]
            );
            let siz = new THREE.Vector3(
                data.findings[i].scale[0],
                data.findings[i].scale[1],
                data.findings[i].scale[2]
            );
            let col = data.findings[i].color;
            addcube(pos, rot, siz, col);
        }
    });

//o represents the selected object, it is null when we are in the main view
let o = null;
//cache the raycaster for better performance
const raycaster = new THREE.Raycaster();
//this array will hold all raycast intersects
let intersects = new Array();
document.body.onclick = function (event) {
    if (event.ctrlKey) {
        //we right clicked
        if (o === null) {
            //we were in the main view
            let mouse = new THREE.Vector2();
            //we need to get the coordinates of the mouse cursor on the screen
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            //send a ray from the camera to the cursor
            raycaster.setFromCamera(mouse, camera);
            intersects = raycaster.intersectObjects(objects);
            if (intersects.length > 0) {
                o = intersects[0].object;
                //the ray intersected something => we ctrl-clicked on a finding
                //we must hide everything in the scene that is not the selected object
                camera.layers.disable(0); //the findings and site section only have layer 0 enabled, so we disable it for the camera to hide them
                camera.layers.disable(2); //we hide the archeological layers as well in focus view
                o = intersects[0].object;
                o.layers.enable(1); //enable layer 1 on the finding we selected so the camera can see it
            }
        } else {
            if (!(o === null)) {
                //we were in "focused" view and must switch to main view, we must reveal all hidden objects
                o.layers.disable(1); //we need to disable layer 1 for the previously viewed object, otherwise it would stay visible next time we enter focus view
                o = null; //we set o to null to let the other functions know we are now in the main view
                camera.layers.enable(0); //make it so the camera can see the other objects in the site section
                camera.layers.enable(2); //this way we can see the archeological layers which would normally be visible to us in the main view
            }
        }
    }
};

//handle layers and the site section object
let layers = new Array(); //contains all layers
let currentlayer = 0; //int - represents the top visible layer
fetch("../Data/SiteSection.json")
    .then((response) => response.json())
    .then((data) => {
        let brownTexture = textureLoader.load(brown);
        let yellowTexture = textureLoader.load(yellow);
        let lightYellowTexture = textureLoader.load(lightyellow);
        let blueTexture = textureLoader.load(blue);
        let lightBlueTexture = textureLoader.load(lightblue);
        //make the site section object
        let siteScale = new THREE.Vector3(
            parseFloat(data.scale[0]),
            parseFloat(data.scale[1]),
            parseFloat(data.scale[2])
        );
        //the scale will be used to calculate the height of an individual archeological layer
        gltfLoader.load(
            "../assets/models/SiteBottom.glb",
            function (gltf) {
                gltf.scene.scale.set(siteScale.x, siteScale.y, siteScale.z);
                scene.add(gltf.scene);
                let child = gltf.scene.children[0];
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        map: brownTexture,
                    });
                }
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );

        //we now need to add the archeological layers
        function addLayer(height, scale, layerTexture, stripTexture) {
            //generate a layer with a given position, rotation, scale and color (WIP)
            gltfLoader.load(
                "../assets/models/Layer.glb",
                function (gltf) {
                    gltf.scene.scale.set(scale.x, scale.y, scale.z);
                    gltf.scene.position.y = height;
                    scene.add(gltf.scene);
                    //we need to change the children's material and layers
                    let child = gltf.scene.children[0];
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            map: layerTexture,
                        });
                    }
                    child.layers.disable(0);
                    child.layers.enable(2);
                    layers.push(gltf.scene);
                },
                undefined,
                function (error) {
                    console.error(error);
                }
            );
            //generate a layer strip
            gltfLoader.load(
                "../assets/models/LayerStrip.glb",
                function (gltf) {
                    gltf.scene.scale.set(scale.x, scale.y, scale.z);
                    gltf.scene.position.y = height;
                    scene.add(gltf.scene);
                    let child = gltf.scene.children[0];
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            //give layer strips a different color from the actual layer, so we can actually differentiate between them
                            map: stripTexture,
                        });
                    }
                },
                undefined,
                function (error) {
                    console.error(error);
                }
            );
        }
        let nroflayers = data.layernr;
        let layerheight = siteScale.y / nroflayers;
        let scale = new THREE.Vector3(siteScale.x, layerheight, siteScale.z);
        for (let i = 0; i < nroflayers; i++) {
            //add a layer
            if (i % 2 == 0) {
                addLayer(
                    siteScale.y - ((i + 1) * 2 - 1) * layerheight,
                    scale,
                    yellowTexture,
                    lightYellowTexture
                );
            } else {
                addLayer(
                    siteScale.y - ((i + 1) * 2 - 1) * layerheight,
                    scale,
                    blueTexture,
                    lightBlueTexture
                );
            }
        }
    });

// add listener for key press events
document.body.addEventListener("keydown", keyPressed, false);

//this function will detect key presses
function keyPressed(event) {
    if (o === null) {
        //we are currently in the main view
        //we only want to interact with layers in the main view, not in focus view
        switch (event.key) {
            case "z":
                //make layers visible one by one moving upwards
                if (currentlayer > 0) {
                    currentlayer--;
                    layers[currentlayer].traverse(function (object) {
                        object.layers.enable(2);
                    });
                }
                break;
            case "x":
                //make layers invisible one by one moving down
                if (currentlayer < layers.length) {
                    //layers only have layer 2, so by disabling this layer we hide them from the camera
                    layers[currentlayer].traverse(function (object) {
                        object.layers.disable(2);
                    });
                    currentlayer++;
                }
                break;
        }
        //we need to rerender everytime we make a change
        render();
    }
}
