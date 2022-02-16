import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
//import { OBJLoader } from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js'
//import { MTLLoader } from 'https://threejs.org/examples/jsm/loaders/MTLLoader.js'

const scene = new THREE.Scene();
// set the scene's background image
let bgTexture = new THREE.TextureLoader().load("media/christmas/red-bg.jpg");
bgTexture.minFilter = THREE.LinearFilter;
scene.background = bgTexture;

//set camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//Camera position - x,y,z;
camera.position.set(1,0,5);
camera.lookAt( 0, 0, 0 );

// set renderer
const renderer = new THREE.WebGLRenderer({antialias : true});
renderer.autoClear = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor("#ffffff");
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// set controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.autoRotate = true;

//Append the renderer to the DOM
//document.body.appendChild(renderer.domElement);
document.getElementById("threejs").appendChild(renderer.domElement);

// set light
var light = new THREE.DirectionalLight( 0xc8af08, 1 );
light.position.set(20, 100, 10 );
light.target.position.set(0,0,0);
light.CastShadow = true;
scene.add( light );

//add a Raycaster to animate element on hover
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector3();

// add an object and material from files
//let mtlLoader = new MTLLoader();
//mtlLoader.setPath('./assets/sphere/');
//mtlLoader.load("sphere.mtl", function(material) {
//material.preload();
//let objLoader = new OBJLoader();
//objLoader.setMaterials(material);
//objLoader.setPath('./assets/sphere/');
//objLoader.load("wireframe-globe.obj", function(object){
	//scene.add(object);
	//object.position.set(10,3,-3);
//});
//});

// draw the stars
// create textures for each side of the stars
var starTexture = new THREE.TextureLoader().load( "media/christmas/pexels-dzenina-lukac-754191.jpg" );
var stars = [];

for (let i = 0; i < 250; i++) {
  let geometry = new THREE.SphereGeometry( 0.05, 0.05, 50);
  let material = new THREE.MeshBasicMaterial( { map: starTexture } );
  let star = new THREE.Mesh( geometry, material );
  star.position.set( getRandom(), getRandom(), getRandom() );
  star.material.side = THREE.DoubleSide;
  stars.push( star );
}
for (let j = 0; j < stars.length; j++) {
  scene.add( stars[j] );
}

// create textures for each side of the cubes
let loader = new THREE.CubeTextureLoader();
loader.setPath( 'media/christmas/' );

let textureCube = loader.load( [
	'pexels-dzenina-lukac-754191.jpg', 'pexels-ekaterina-bolovtsova-5702943.jpg',
	'pexels-jj-jordan-7981894.jpg', 'pexels-julia-larson-6113398.jpg',
	'pexels-thirdman-6533912.jpg', 'pexels-pavel-danilyuk-5623616.jpg'
] );
textureCube.minFilter = THREE.LinearFilter;

let colorSphere = 0xF0EFF1;
// draw one circles
var geometry = new THREE.SphereGeometry(1.5, 32, 25);
var materialSph = new THREE.MeshStandardMaterial({envMap: textureCube, wireframe: false});
materialSph.metalness = 0.7;
materialSph.roughness = 0.3;
materialSph.color = new THREE.Color(colorSphere)
var mesh = new THREE.Mesh(geometry, materialSph);
mesh.position.x = 0;
mesh.position.y = 0;
mesh.position.z = 0;
scene.add(mesh);

// draw one circles
var geometryNew = new THREE.SphereGeometry(2, 32, 25);
var materialSphNew = new THREE.MeshStandardMaterial({envMap: textureCube, wireframe: true});
materialSphNew.metalness = 0.7;
materialSphNew.roughness = 0.3;
materialSphNew.color = new THREE.Color(colorSphere)
var meshNew = new THREE.Mesh(geometryNew, materialSphNew);
meshNew.position.x = 0.5;
meshNew.position.y = 0;
meshNew.position.z = 0;
scene.add(meshNew);

//add parallex effect to the Sphere
const updateSphere = (event) => {
  event.preventDefault();

  mesh.position.y = window.scrollY * .004;
	meshNew.position.y = window.scrollY * .004;
}
document.addEventListener('scroll', updateSphere)

// Animate on hover
function onMousemove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  //this returns an array based on the objects that have intersects
  let intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    // Animate with TweenLite library
    let tl = TweenLite.to(intersects[0].object.rotation, 2, {y: Math.PI*1.5, ease: Expo.easeOut, onComplete: function myFunction(){
			intersects[0].object.rotation.y = -Math.PI*1.5;
		}});
  }
}
window.addEventListener('mousemove', onMousemove);

var lightness = 0;
function animate() {
	let i = 0.00001;
	scene.traverse( function(child) {
		if (child instanceof THREE.Mesh) {
			// rotate cubes
			child.rotation.x += i;
			child.rotation.y += i;
			i+=0.00001;
		}
	});

	for (let k = 0; k < stars.length; k++) {
    let star = stars[k];
    star.rotation.x += 0.01;
    star.rotation.y += 0.01;
		// twinkle
		lightness > 150 ? lightness = 0 : lightness++;
		star.material.color = new THREE.Color("hsl(58, 100%, " + lightness + "%)");
}

	controls.update();
	requestAnimationFrame(animate);
	renderer.render( scene, camera );
}
animate();

// generate random numbers
function getRandom() {
  var num = Math.floor(Math.random()*10) + 1;
  num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  return num;
}
