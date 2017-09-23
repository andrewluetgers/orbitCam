
// requires https://github.com/mrdoob/three.js and THREE global
// requires https://github.com/mattdesl/three-orbit-controls
// requires https://github.com/tweenjs/tween.js and TWEEN global
(function (root) {
	
	function OrbitCam(THREE, TWEEN, camera, renderer) {
		var controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.enableZoom = true;
		
		function rad(degrees) {return degrees * Math.PI/180}
		function minRotation(current, to) {
			return Math.atan2(Math.sin(to - current), Math.cos(to - current));
		}
		
		var defMs = 300;
		function dms(ms) {
			return (ms !== undefined) ? ms : defMs;
		}
		
		/**
		 *
		 * @param azimuthDeg (number) degrees to rotate left or right range: unlimited
		 * @param polarDeg (number) degrees to rotate up or down range: -180 to 180
		 * @param options (object) {
		 *      relative: (boolean) truthy if motion should be relative to current position
		 *                          otherwise rotation degrees will be treated as absolute targets
		 *      duration: (number) milliseconds for duration of camera animation default: 300,
		 *      ease: (function) Tween.js tween function, default: TWEEN.Easing.Quadratic.InOut
		 *      onComplete: (function) called at end of animation
		 * }
		 * @returns {number|*}
		 */
		function rotate(azimuthDeg, polarDeg, options) {
			var o = 	    options || {},
				ms =		(o.duration !== undefined) ? o.duration : defMs,
				ease =		o.ease,
				rel = 		o.relative,
				theta =		controls.getAzimuthalAngle(),
				phi =		controls.getPolarAngle(),
				deltaT =	rel ? rad(azimuthDeg) : minRotation(theta, rad(azimuthDeg)),
				deltaP =	rel ? rad(polarDeg)   : minRotation(phi, rad(polarDeg)),
				prevT = 	theta,
				prevP = 	phi,
				stepT = 	0,
				stepP = 	0,
				from = 		{theta: theta, phi: phi},
				to = 		{theta: theta+(deltaT*-1), phi: phi+(deltaP*-1)};
			
			function upd() {
				stepT = from.theta-prevT;
				stepP = from.phi-prevP;
				prevT = from.theta;
				prevP = from.phi;
				controls.rotateLeft(stepT);
				controls.rotateUp(stepP);
			}
			
			return new TWEEN
				.Tween(from)
				.to(to, ms)
				.easing(ease || TWEEN.Easing.Quadratic.InOut)
				.onUpdate(upd)
				.onComplete(function() {
					o.onComplete && o.onComplete();
				})
				.start();
		}
		
		function update() {
			controls.update();
			TWEEN.update();
		}
		
		// relative rotation convenience functions
		return {
			
			// the THREE.OrbitControls instance
			controls: controls,
			
			// call in the render loop
			update: update,
			
			// animated relative and absolute rotation by degree
			rotate: rotate,
			
			// animate a specific directional rotation
			go: {
				right:  function(deg, ms) {rotate(deg || 90, 0,     {relative: true, duration: dms(ms)})},
				left:   function(deg, ms) {rotate(deg*-1 || -90, 0, {relative: true, duration: dms(ms)})},
				up:     function(deg, ms) {rotate(0, deg*-1 || -90, {relative: true, duration: dms(ms)})},
				down:   function(deg, ms) {rotate(0, deg || 90,     {relative: true, duration: dms(ms)})}
			},
			
			// animate to a specific view like in a cad program
			to: {
				right:  function(ms) {rotate(90,  90,  {duration: dms(ms)})},
				left:   function(ms) {rotate(270, 90,  {duration: dms(ms)})},
				top:    function(ms) {rotate(0,   0,   {duration: dms(ms)})},
				bottom: function(ms) {rotate(0,   180, {duration: dms(ms)})},
				front:  function(ms) {rotate(0,   90,  {duration: dms(ms)})},
				back:   function(ms) {rotate(180, 90,  {duration: dms(ms)})}
			}
		};
	}
	
	// UMD (Universal Module Definition)
	if (typeof define === 'function' && define.amd) { // AMD
		define([], function() {return OrbitCam});
		
	} else if (typeof module !== 'undefined' && typeof exports === 'object') { // Node.js
		module.exports = OrbitCam;
		
	} else if (root !== undefined) { // Global variable
		root.OrbitCam = OrbitCam;
	}
})(this);


