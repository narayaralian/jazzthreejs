const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('texture/NormalMap.png')

// Debug
const gui = new dat.GUI()

// first set the three basic elements of three.js - scene, camera, and renderer
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
//camera position - x,y,z;
camera.position.set(0,1,9);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.autoClear = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//make the scene responsive
window.addEventListener('resize', ()=> {
  //resize the renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  //reset the camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  //update the project matrix
  camera.updateProjectionMatrix();
})

//add a Raycaster to animate element on hover
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector3();

// draw spheres
for(var i = 0; i < 7; i++){
  var geometry = new THREE.SphereBufferGeometry(1, 4, 25);
  var materialSph = new THREE.MeshStandardMaterial();
  materialSph.metalness = 0.7;
  materialSph.roughness = 0.2;
  materialSph.color = new THREE.Color(0xff0000)
  var mesh = new THREE.Mesh(geometry, materialSph);
  mesh.position.x = (Math.random() - 0.5) * 10;
  mesh.position.y = (Math.random() - 0.5) * 10;
  mesh.position.z = (Math.random() - 0.5) * 10;
  scene.add(mesh);
}

// draw boxes

var color = 0xF0EFF1;
for(var i = 0; i < 30; i++){
  var geometryBox = new THREE.SphereBufferGeometry(1, 1, 1);
  var materialBox = new THREE.MeshLambertMaterial({color: color});
  materialBox.metalness = 0.7;
  materialBox.roughness = 0.2;
  var meshBox = new THREE.Mesh(geometryBox, materialBox);
  meshBox.position.x = (Math.random() - 0.5) * 10;
  meshBox.position.y = (Math.random() - 0.5) * 10;
  meshBox.position.z = (Math.random() - 0.5) * 10;
  scene.add(meshBox);
}

// Lights

const pointLight = new THREE.PointLight(0x272727, 0.1)
pointLight.position.x = -2
pointLight.position.y = 3
pointLight.position.z = 4
pointLight.intensity = 1
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xfefefe, 0.1)
pointLight2.position.set(3, 1, 0.5)
pointLight2.intensity = 3
scene.add(pointLight2)

var render = function() {
  requestAnimationFrame(render);
  //rotate the Box on x
  meshBox.rotation.x += 0.01;
  // rotate the Box on y
  meshBox.rotation.y += 0.01;
  //rotate the Box on x
  mesh.rotation.x += 0.01;
  // rotate the Box on y
  mesh.rotation.y += 0.01;

  renderer.render(scene, camera);
}

// Animate Shperes and Boxes on hover
function onMousemove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  //this returns an array based on the objects that have intersects
  var intersects = raycaster.intersectObjects(scene.children, true);
  for(var i=0; i < intersects.length; i++) {
    // Animate with TweenMax library
    this.tl = new TimelineMax();
    //apply animation to the Box element
    this.tl.to(intersects[i].object.scale, 2, {x: 2, ease: Expo.easeOut});
    this.tl.to(intersects[i].object.scale, 2, {x: 1, ease: Expo.easeOut});
    this.tl.to(intersects[i].object.rotation, 15, {y: Math.PI*1.5, ease: Expo.easeOut});
    this.tl.to(intersects[i].object.position, 10, {y: (Math.random() - 0.5) * 10, ease: Expo.easeOut, speed: '3s'});
    this.tl.to(intersects[i].object.position, 10, {x: (Math.random() - 0.5) * 10, ease: Expo.easeOut, speed: '3s'});
    this.tl.to(intersects[i].object.position, 10, {z: (Math.random() - 0.5) * 10, ease: Expo.easeOut, speed: '3s'});
    this.tl.to(intersects[i].object.position, 15, {y: (Math.random() + 3), ease: Expo.easeOut, speed: '3s'});

    //this.tl.to(intersects[i].object.material.color.set(Math.random() * 0xeeeeee));
  }
}

// Add GUI Controls in separate folders for Debug
const light = gui.addFolder('Light 1')
const light2 = gui.addFolder('Light 2')
const camPosition = gui.addFolder('Camera Position')

camPosition.add(camera.position, 'y').min(-10).max(10).step(0.01)
camPosition.add(camera.position, 'x').min(-10).max(10).step(0.01)
camPosition.add(camera.position, 'z').min(-10).max(10).step(0.01)
camPosition.add(camera, 'fov', 1, 180).onChange(updateCamera)
camPosition.add(camera, 'near', 0.1, 10).onChange(updateCamera)
camPosition.add(camera, 'far', 100, 1000).onChange(updateCamera)


light.add(pointLight.position, 'y').min(-3).max(3).step(0.01)
light.add(pointLight.position, 'x').min(-6).max(6).step(0.01)
light.add(pointLight.position, 'z').min(-3).max(3).step(0.01)
light.add(pointLight, 'intensity').min(0).max(10).step(0.01)


light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01)
light2.add(pointLight2.position, 'x').min(-6).max(6).step(0.01)
light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01)
light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

const lightColor = {
  color: 0xff000
}
light.addColor(lightColor, 'color')
  .onChange(()=>{
    pointLight.color.set(lightColor.color)
  })

const light2Color = {
  color: 0xff000
}

light2.addColor(light2Color, 'color')
  .onChange(()=>{
    pointLight2.color.set(light2Color.color)
  })

  function updateCamera() {
    camera.updateProjectionMatrix();
  }


render();

//animate on hover
window.addEventListener('mousemove', onMousemove);
