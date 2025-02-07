var scene, camera, renderer, geometry, group, controls; // Added controls for camera movement

init();
render();

function init() {
  scene = new THREE.Scene();

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 15;

  geometry = new THREE.BoxGeometry(1, 1, 1);

  var leaveDarkMaterial = new THREE.MeshLambertMaterial({ color: 0x91e56e });
  var leaveLightMaterial = new THREE.MeshLambertMaterial({ color: 0xa2ff7a });
  var leaveDarkDarkMaterial = new THREE.MeshLambertMaterial({
    color: 0x71b356,
  });
  var stemMaterial = new THREE.MeshLambertMaterial({ color: 0x7d5a4f });

  var light = new THREE.DirectionalLight(0xeeffd3, 1);
  light.position.set(0, 0, 1);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Color, intensity
  scene.add(ambientLight);

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
    var tree = new THREE.Group();
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
    for (let i = 0; i < 15; i++) {
      let tree = treeGeneration();
      
      let newX = (Math.random() * 10) - 3;  // This will give you a value between -5 and 5
      let newZ = (Math.random() * 10) - 3;
newX = Math.random() * -5;
      tree.position.set(newX, tree.position.y, newZ);
      scene.add(tree);
    }
  }

  // tree.rotation.y = 1;
  // tree.rotation.x = 0.5;

  forestGeneration();

  // Renderer setup
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.setClearColor("skyblue", 1);  // 0x0000FF is the hex code for blue


  // Initialize OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // smooth movement
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false; // to restrict up/down camera movement
}

function render() {
  requestAnimationFrame(render);

  // tree.rotation.y += 0.0007;

  // Update the controls
  controls.update(); // only required if controls.enableDamping = true, or if controls.auto-rotation is enabled

  renderer.render(scene, camera);
}
