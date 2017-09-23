# orbitCam
Simple animated camera rotations api for [Three.js](https://threejs.org/) [OrbitControls](https://github.com/mattdesl/three-orbit-controls)

Animations use [Tween.js](https://github.com/tweenjs/tween.js/)

### Install
```
npm install orbitcam
```
Can also load src/OrbitCam.js directly into a browser and it will assign itself to the OrbitCam global.


### Initialization
```
var orbitCam = OrbitCam(THREE, TWEEN, camera, renderer);

// call update in the render loop like so
function mainLoop() {
    orbitCam.update();
    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
}

mainLoop();

```

## Usage
```
// relative movement with the go function
// 30 degrees over 500ms
orbitCam.go.right(30, 500);

// absolute animation with the to function
// directly center on a given view over 500ms
orbitCam.to.front(500)

// more options with the rotate function
// up 30 and to the right 1125 degrees, over 1000 milliseconds.
orbitCam.rotate(1125, -30, {duration: 1000, relative: true});
```

See source and example for more details.
