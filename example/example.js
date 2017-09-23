var camera, scene, renderer, orbitCam;

function init(isPerspective) {
	
	var width = window.innerWidth,
		height = window.innerHeight;
	
	if (isPerspective) {
		camera = new THREE.PerspectiveCamera(60, width / height, 2, 10000);
	} else {
		camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 10000 );
	}
	
	camera.position.set( 0, 0, 200 );
	
	scene = new THREE.Scene();
	
	//Cube
	var textures = [
			'3.png', // right
			'2.png', // left
			'5.png', // top
			'4.png', // bottom
			'1.png', // front
			'6.png'  // back
		],
		geometry = new THREE.BoxGeometry(80, 80, 80, 3, 3, 3),
		materials = textures.map(function(t) {
			var loader = new THREE.TextureLoader(),
				tex = loader.load(t);
			return new THREE.MeshPhongMaterial({color: 0xffffff, map:tex});
		});
	
	cube = new THREE.Mesh(geometry, materials);
	cube.position.set(0, 0, 0);
	scene.add(cube);
	
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor (0x444444, 1);
	
	orbitCam = OrbitCam(camera, renderer);
	orbitCam.rotate(45, 45, {duration: 1000});
	
	document.body.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);
	
	// light
	var ambient = new THREE.AmbientLight(0xfefeff);
	scene.add(ambient);
	
	
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
	function mainLoop() {
		orbitCam.controls.update();
		TWEEN.update();
		renderer.render(scene, camera);
		requestAnimationFrame(mainLoop);
	}
	
	mainLoop();
}

init(true);