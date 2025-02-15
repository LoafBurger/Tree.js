var scene, camera, renderer, geometry, group, controls; // Added controls for camera movement
let mouseDown = true; //very temporary fix, but just set mouseDown to True, and they will always jump (discovered by holding down mouse lol)

var clouds = [];
var sheeps = [];

let points = [];

//the functions that run
init();
render();

// function onMouseDown(event) {
//   mouseDown = true;
// }
//
// function onMouseUp() {
//   mouseDown = false;
// }

function init() {
  scene = new THREE.Scene();

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 30;
  camera.position.y = 5;

  geometry = new THREE.BoxGeometry(1, 1, 1);

  var leaveDarkMaterial = new THREE.MeshLambertMaterial({ color: 0x91e56e });
  var leaveLightMaterial = new THREE.MeshLambertMaterial({ color: 0xa2ff7a });
  var leaveDarkDarkMaterial = new THREE.MeshLambertMaterial({
    color: 0x71b356,
  });
  var stemMaterial = new THREE.MeshLambertMaterial({ color: 0x7d5a4f });
  var cloudMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

  var light = new THREE.DirectionalLight(0xeeffd3, 1);
  light.position.set(10, 10, 10);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Color, intensity
  scene.add(ambientLight);

  var terrain = new THREE.Mesh(geometry, leaveDarkDarkMaterial);
  terrain.position.set(0, -1, 0);
  terrain.scale.set(50, 0.8, 50);

  scene.add(terrain);
  scene.fog = new THREE.FogExp2(0x053d21, 0.005); //fog but doesn't really do anything

  // Particles
  const particles = 1000;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const sizes = [];
  const color = new THREE.Color();
  const radius = 250;

  for (let i = 0; i < particles; i++) {
    // position of particles
    positions.push((Math.random() * 2 - 1) * radius);
    positions.push((Math.random() * 2 - 1) * radius);
    positions.push((Math.random() * 2 - 1) * radius);

    // Set all particles to yellow (RGB: 1,1,0)
    colors.push(255, 255, 0);

    sizes.push(20);
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  particleGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3),
  );
  const particleMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending, //changed from some multiplication bending, fixed black issue
    side: THREE.FrontSide,
  });
  points = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(points);

  function treeGeneration() {
    var stem = new THREE.Mesh(geometry, stemMaterial);
    stem.position.set(0, 0, 0);
    stem.scale.set(0.3, 1.5, 0.3);

    var squareLeave01 = new THREE.Mesh(geometry, leaveDarkMaterial);
    squareLeave01.position.set(0.5, 1.6, 0.5);
    squareLeave01.scale.set(0.8, 0.8, 0.8);

    var squareLeave02 = new THREE.Mesh(geometry, leaveDarkMaterial);
    squareLeave02.position.set(-0.4, 1.3, -0.4);
    squareLeave02.scale.set(0.7, 0.7, 0.7);

    var squareLeave03 = new THREE.Mesh(geometry, leaveDarkMaterial);
    squareLeave03.position.set(0.4, 1.7, -0.5);
    squareLeave03.scale.set(0.7, 0.7, 0.7);

    var leaveDark = new THREE.Mesh(geometry, leaveDarkMaterial);
    leaveDark.position.set(0, 1.2, 0);
    leaveDark.scale.set(1, 2, 1);

    var leaveLight = new THREE.Mesh(geometry, leaveLightMaterial);
    leaveLight.position.set(0, 1.2, 0);
    leaveLight.scale.set(1.1, 0.5, 1.1);

    var ground = new THREE.Mesh(geometry, leaveDarkDarkMaterial);
    ground.position.set(0, -1, 0);
    ground.scale.set(2.4, 0.8, 2.4);

    // Create tree group
    tree = new THREE.Group(); //dont make the group a var!
    tree.add(leaveDark);
    tree.add(leaveLight);
    tree.add(squareLeave01);
    tree.add(squareLeave02);
    tree.add(squareLeave03);
    tree.add(ground);
    tree.add(stem);

    return tree;
  }

  function forestGeneration() {
    for (let i = 0; i < 25; i++) {
      let tree = treeGeneration();

      let newX = Math.random() * 40 - 20; // This will give you a value between -5 and 5
      let newZ = Math.random() * 35 - 15;
      tree.position.set(newX, tree.position.y, newZ);
      tree.scale.set(1.5, 1.5, 1.5);
      scene.add(tree);
    }
  }

  forestGeneration();

  //cloud rendering test
  function cloudGeneration() {
    var fluff1 = new THREE.Mesh(geometry, cloudMaterial);
    fluff1.position.set(0.5, 1.6, 0.5);
    fluff1.scale.set(2.3, 0.8, 1);

    var fluff2 = new THREE.Mesh(geometry, cloudMaterial);
    fluff2.position.set(-0.4, 1.3, -0.4);
    fluff2.scale.set(1.2, 0.7, 1.4);

    var fluff3 = new THREE.Mesh(geometry, cloudMaterial);
    fluff3.position.set(0.4, 1.7, 0.4);
    fluff3.scale.set(0.8, 0.7, 2);

    cloud = new THREE.Group(); //remember when you give it a var it will break!
    cloud.add(fluff1);
    cloud.add(fluff2);
    cloud.add(fluff3);

    // Give each cloud its own random movement speed and direction
    cloud.movement = Math.random() < 0.5 ? 0.01 : -0.01;

    return cloud;
  }

  function genusGeneration() {
    for (let i = 0; i < 15; i++) {
      let cloud = cloudGeneration();
      let newY = Math.random() * 8 + 5;
      let newX = Math.random() * 30 - 15;
      let newZ = Math.random() * 30 - 15;
      cloud.position.set(newX, newY, newZ);
      scene.add(cloud);
      clouds.push(cloud);
    }
  }

  genusGeneration();

  //sheep class
  class Sheep {
    constructor() {
      this.group = new THREE.Group();
      this.group.position.y = 0.4;
      this.group.rotation.y = Math.random() * Math.PI * 2; //remmeber, group is not a group of sheep, its a group of meshes
      this.group.movement = 0.05;

      this.woolMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1,
        shading: THREE.FlatShading,
      });
      this.skinMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaf8b,
        roughness: 1,
        shading: THREE.FlatShading,
      });
      this.darkMaterial = new THREE.MeshStandardMaterial({
        color: 0x4b4553,
        roughness: 1,
        shading: THREE.FlatShading,
      });

      this.vAngle = 0;

      this.drawBody();
      this.drawHead();
      this.drawLegs();
    }
    drawBody() {
      const bodyGeometry = new THREE.IcosahedronGeometry(1.7, 0);
      const body = new THREE.Mesh(bodyGeometry, this.woolMaterial);
      body.castShadow = true;
      body.receiveShadow = true;
      this.group.add(body);
    }
    drawHead() {
      const head = new THREE.Group();
      head.position.set(0, 0.65, 1.6);
      head.rotation.x = rad(-20);
      this.group.add(head);

      const foreheadGeometry = new THREE.BoxGeometry(0.7, 0.6, 0.7);
      const forehead = new THREE.Mesh(foreheadGeometry, this.skinMaterial);
      forehead.castShadow = true;
      forehead.receiveShadow = true;
      forehead.position.y = -0.15;
      head.add(forehead);

      const faceGeometry = new THREE.CylinderGeometry(0.5, 0.15, 0.4, 4, 1);
      const face = new THREE.Mesh(faceGeometry, this.skinMaterial);
      face.castShadow = true;
      face.receiveShadow = true;
      face.position.y = -0.65;
      face.rotation.y = rad(45);
      head.add(face);

      const woolGeometry = new THREE.BoxGeometry(0.84, 0.46, 0.9);
      const wool = new THREE.Mesh(woolGeometry, this.woolMaterial);
      wool.position.set(0, 0.12, 0.07);
      wool.rotation.x = rad(20);
      head.add(wool);

      const rightEyeGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.06, 6);
      const rightEye = new THREE.Mesh(rightEyeGeometry, this.darkMaterial);
      rightEye.castShadow = true;
      rightEye.receiveShadow = true;
      rightEye.position.set(0.35, -0.48, 0.33);
      rightEye.rotation.set(rad(130.8), 0, rad(-45));
      head.add(rightEye);

      const leftEye = rightEye.clone();
      leftEye.position.x = -rightEye.position.x;
      leftEye.rotation.z = -rightEye.rotation.z;
      head.add(leftEye);

      const rightEarGeometry = new THREE.BoxGeometry(0.12, 0.5, 0.3);
      rightEarGeometry.translate(0, -0.25, 0);
      this.rightEar = new THREE.Mesh(rightEarGeometry, this.skinMaterial);
      this.rightEar.castShadow = true;
      this.rightEar.receiveShadow = true;
      this.rightEar.position.set(0.35, -0.12, -0.07);
      this.rightEar.rotation.set(rad(20), 0, rad(50));
      head.add(this.rightEar);

      this.leftEar = this.rightEar.clone();
      this.leftEar.position.x = -this.rightEar.position.x;
      this.leftEar.rotation.z = -this.rightEar.rotation.z;
      head.add(this.leftEar);
    }
    drawLegs() {
      const legGeometry = new THREE.CylinderGeometry(0.3, 0.15, 1, 4);
      legGeometry.translate(0, -0.5, 0);
      this.frontRightLeg = new THREE.Mesh(legGeometry, this.darkMaterial);
      this.frontRightLeg.castShadow = true;
      this.frontRightLeg.receiveShadow = true;
      this.frontRightLeg.position.set(0.7, -0.8, 0.5);
      this.frontRightLeg.rotation.x = rad(-12);
      this.group.add(this.frontRightLeg);

      this.frontLeftLeg = this.frontRightLeg.clone();
      this.frontLeftLeg.position.x = -this.frontRightLeg.position.x;
      this.frontLeftLeg.rotation.z = -this.frontRightLeg.rotation.z;
      this.group.add(this.frontLeftLeg);

      this.backRightLeg = this.frontRightLeg.clone();
      this.backRightLeg.position.z = -this.frontRightLeg.position.z;
      this.backRightLeg.rotation.x = -this.frontRightLeg.rotation.x;
      this.group.add(this.backRightLeg);

      this.backLeftLeg = this.frontLeftLeg.clone();
      this.backLeftLeg.position.z = -this.frontLeftLeg.position.z;
      this.backLeftLeg.rotation.x = -this.frontLeftLeg.rotation.x;
      this.group.add(this.backLeftLeg);
    }

    jump(speed) {
      this.vAngle += speed;
      this.group.position.y = Math.sin(this.vAngle) + 1.38;

      const legRotation = (Math.sin(this.vAngle) * Math.PI) / 6 + 0.4;

      this.frontRightLeg.rotation.z = legRotation;
      this.backRightLeg.rotation.z = legRotation;
      this.frontLeftLeg.rotation.z = -legRotation;
      this.backLeftLeg.rotation.z = -legRotation;

      const earRotation = (Math.sin(this.vAngle) * Math.PI) / 3 + 1.5;

      this.rightEar.rotation.z = earRotation;
      this.leftEar.rotation.z = -earRotation;
    }

    jumpOnMouseDown() {
      if (mouseDown) {
        this.jump(0.05);
      } else {
        if (this.group.position.y <= 0.4) return;
        this.jump(0.08);
      }
    }
  }

  //sheep test
  function rad(degrees) {
    return degrees * (Math.PI / 180);
  }

  function sheepCreation() {
    sheep = new Sheep();
    sheep.group.scale.set(0.5, 0.5, 0.5);
    return sheep;
  }

  function herdGeneration() {
    for (let i = 0; i < 15; i++) {
      let sheep = sheepCreation();
      let newX = Math.random() * 40 - 20;
      let newZ = Math.random() * 30 - 15;
      sheep.group.position.set(newX, sheep.group.position.y, newZ); //the way the class is created, you need to call .group first
      scene.add(sheep.group);
      sheeps.push(sheep);
    }
  }

  herdGeneration();

  // Renderer setup
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.setClearColor("#131862", 1); // for "sky" color
  // document.addEventListener('mousedown', onMouseDown);
  // document.addEventListener('mouseup', onMouseUp);

  // Initialize OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // smooth movement
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false; // to restrict up/down camera movement
}

function render() {
  requestAnimationFrame(render);

  // Update all clouds using their individual movement values
  clouds.forEach((cloud) => {
    cloud.position.x += cloud.movement;

    // Reverse direction at boundaries
    if (cloud.position.x > 20 || cloud.position.x < -20) {
      cloud.movement = -cloud.movement;
    }
  });

  sheeps.forEach((sheep) => {
    const time = Date.now() * 0.05;
    points.rotation.z = 0.001 * time;
    const direction = new THREE.Vector3();
    sheep.group.getWorldDirection(direction);
    sheep.group.position.add(direction.multiplyScalar(sheep.group.movement)); // speed is how far to move
    if (
      sheep.group.position.x > 20 ||
      sheep.group.position.x < -20 ||
      sheep.group.position.z > 20 ||
      sheep.group.position.z < -20
    ) {
      sheep.group.rotation.y += 180;
      // sheep.group.movement = -sheep.group.movement;  //so silly - if you are going to rely on getWorldDirection, you don't need this!
    }
    sheep.jumpOnMouseDown();
    // sheep.group.position.x += sheep.group.movement;
  });
  // Update the controls
  controls.update(); // only required if controls.enableDamping = true, or if controls.auto-rotation is enabled

  // sheep.jumpOnMouseDown(); //whenever there is glitchy stuff with an entity, you most likely have a redundant, or not, line you don't need. Also, where it is located matters too

  renderer.render(scene, camera);
}
