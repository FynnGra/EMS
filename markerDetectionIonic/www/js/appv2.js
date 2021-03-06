/*
 * Description: Web based augmented reality application using WebGL/WebRTC, JSARToolKit, THREE.js
 *              and the Ionic framework.
 *
 *
 * Sources: http://www.html5rocks.com/en/tutorials/webgl/jsartoolkit_webrtc/
 *          http://www.html5rocks.com/en/tutorials/getusermedia/intro/
 *          https://github.com/kig/JSARToolKit
 *          http://threejs.org/docs/
 *          https://docs.angularjs.org/guide
 *
 * Version: 2.0
 *
 * Date:    06.12.2015
 *
 * Authors: Eduard Boitschenko & Fynn Grandke
 */

//=======================================
// INIT VIDEO CAMERA STREAM
//=======================================

//Initialize video camera
var video = document.createElement('video');
var width = 320; //1280(unstable) - 960 - 640 - 320(bad marker detection)
var height = 240; //720(unstable) - 540 - 480 - 240(bad marker detection)

video.width = width;
video.height = height;
video.loop = true;
video.autoplay = true;

//Checking for browser vendor prefixes.
navigator.getUserMedia = (navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia);

//This function goes through all audio/video sources of the users device.
//It selects ONLY the last camera found as the media stream source and ignores AUDIO sources.
MediaStreamTrack.getSources(function(sourceInfos) {
  var videoSource = null;

  for (var i = 0; i != sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === 'video') {
      console.log(sourceInfo.id, sourceInfo.label || 'camera');
      videoSource = sourceInfo.id;
    } else {
      console.log('Some other kind of source: ', sourceInfo);
    }
  }

  sourceSelected(videoSource);
});

//Adds the URL from the selected camera to the video streaming source.
function successCallback(stream){
  video.src = window.URL.createObjectURL(stream);
}

function errorCallback(error){
  console.log('navigator.getUserMedia error: ', error);
  alert("Could not access UserMedia");
}

function sourceSelected(videoSource) {
  var constraints = {
    video: {
      optional: [{sourceId: videoSource}]
    },
    audio: false };

  navigator.getUserMedia(constraints, successCallback, errorCallback);
}


// I'm going to use a glMatrix-style matrix as an intermediary.
// So the first step is to create a function to convert a glMatrix matrix into a Three.js Matrix4.
THREE.Matrix4.prototype.setFromArray = function(m)
{
  return this.set(
    m[0], m[4], m[8], m[12],
    m[1], m[5], m[9], m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15]
  );
};

// Converts the ARToolKit matrices to the THREE.js matrix format.
function copyMatrix(mat, cm) {
  cm[0] = mat.m00;
  cm[1] = -mat.m10;
  cm[2] = mat.m20;
  cm[3] = 0;
  cm[4] = mat.m01;
  cm[5] = -mat.m11;
  cm[6] = mat.m21;
  cm[7] = 0;
  cm[8] = -mat.m02;
  cm[9] = mat.m12;
  cm[10] = -mat.m22;
  cm[11] = 0;
  cm[12] = mat.m03;
  cm[13] = -mat.m13;
  cm[14] = mat.m23;
  cm[15] = 1;
}

var elementLeft,
  elementRight,
  containerLeft,
  containerRight,
  raster,
  param,
  resultMat,
  detector;

var threshold = 128;

//Stores the video frames on which the raster object will operate.
var canvas = document.createElement('canvas');
canvas.width = nextPowerOf2(width);
canvas.height = nextPowerOf2(height);
console.log("canvasWidth: " + canvas.width + "canvasHeight: " + canvas.height);

function nextPowerOf2(x){
 return Math.pow(2, Math.ceil(Math.log(x) / Math.log(2)));
 }

//=======================================
// INIT JSARToolKit
//=======================================

// Create a RGB raster object for the 2D canvas.
// JSARToolKit uses raster objects to read image data.
// Note that you need to set canvas.changed = true on every frame.
raster = new NyARRgbRaster_Canvas2D(canvas);

// FLARParam is the thing used by FLARToolKit to set camera parameters.
// Here we create a FLARParam for images with 320x240 pixel dimensions.
param = new FLARParam(canvas.width, canvas.height);

// Create a NyARTransMatResult object for getting the marker translation matrices.
resultMat = new NyARTransMatResult();

// The FLARMultiIdMarkerDetector is the actual detection engine for marker detection.
// It detects multiple ID markers. ID markers are special markers that encode a number.
detector = new FLARMultiIdMarkerDetector(param, 120);

// For tracking video set continue mode to true. In continue mode, the detector
// tracks markers across multiple frames.
detector.setContinueMode(true);

// glMatrix matrices are flat arrays.
var tmp = new Float32Array(16);

//=======================================
// INIT THREE.JS
//=======================================

//Get an instance of the WebGLRenderer and configure it.
var rendererLeft = new THREE.WebGLRenderer({antialias: true});
var rendererRight = new THREE.WebGLRenderer({antialias: true});

//Create a Three.js scene and camera.
var scene = new THREE.Scene();
var camera = new THREE.Camera();
scene.add(camera);

// Next we need to make the Three.js camera use the FLARParam matrix.
param.copyCameraMatrix(tmp, 10, 10000);
camera.projectionMatrix.setFromArray(tmp);

//Get context of the canvas on which the detection operates.
var ctx = canvas.getContext('2d');

// To display the video, first create a texture from it.
var videoTex = new THREE.Texture(canvas);
videoTex.context = ctx;
videoTex.minFilter = THREE.NearestFilter;


// Then create a plane textured with the video.
var plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2, 2),
  new THREE.MeshBasicMaterial({map: videoTex})
);

// The video plane shouldn't care about the z-buffer.
//plane.material.depthTest = false;
plane.material.depthWrite = false;

// Create a camera and a scene for the video plane and
// add the camera and the video plane to the scene.
var videoScene = new THREE.Scene();
var videoCam = new THREE.Camera();
videoScene.add(plane);
videoScene.add(videoCam);

//Array for the detected markers.
var markers = {};

window.setInterval(function() {

  // Draw the video frame to the canvas.
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Update the video texture.
  videoTex.needsUpdate = true;

  // Tell JSARToolKit that the canvas has changed.
  canvas.changed = true;

  // Do marker detection by using the detector object on the raster object.
  // The threshold parameter determines the threshold value
  // for turning the video frame into a 1-bit black-and-white image.
  var detected = detector.detectMarkerLite(raster, threshold);

  // Go through the detected markers and get their IDs and transformation matrices.
  for (var idx = 0; idx < detected; idx++)
  {
    var id = detector.getIdMarkerData(idx);
    var currId;
    if (id.packetLength > 4) {
      currId = -1;
    }else{
      currId = 0;
      for (var i = 0; i < id.packetLength; i++ ) {
        currId = (currId << 8) | id.getPacketData(i);
        //console.log("id[", i, "]=", id.getPacketData(i));
      }
    }
    //console.log("[add] : ID = " + currId);
    if (!markers[currId]) {
      markers[currId] = {};
    }

    // Get the transformation matrix for the detected marker.
    detector.getTransformMatrix(idx, resultMat);

    markers[currId].age = 0;

    // Copy the result matrix into our marker tracker object.
    markers[currId].transform = Object.asCopy(resultMat);
  }

  for (i in markers)
  {
    var r = markers[i];
    if (r.age > 1) {
      delete markers[i];
      scene.remove(r.model);
    }
    r.age++;
  }

  //Add a cube 3D object for each detected marker.
  for (i in markers)
  {
    var m = markers[i];
    if (!m.model) {
      m.model = new THREE.Object3D();
      var cube = new THREE.Mesh(
        new THREE.BoxGeometry(100,100,100),
        new THREE.MeshBasicMaterial({
          color: 0x00CCFF
        }));
      //console.log("gefunden!");
      cube.position.z = -50;
      cube.doubleSided = true;
      m.model.matrixAutoUpdate = false;
      m.model.add(cube);
      scene.add(m.model);
    }
    copyMatrix(m.transform, tmp);
    m.model.matrix.setFromArray(tmp);
    m.model.matrixWorldNeedsUpdate = true;
  }
}, 20);

//=======================================
// INIT ANGULAR.JS AND IONIC
//=======================================

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      ionic.Platform.fullScreen();
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  //=======================================
  // RENDER LEFT SIDE
  //=======================================
  .directive('webcamleftGl', [function() {

    return {
      restrict: 'E',
      link: function($scope, $element) {
        create($element[0]);
      }
    };

    function create(glFrame) {

      elementLeft = rendererLeft.domElement;
      containerLeft = glFrame;
      containerLeft.appendChild(elementLeft);
      rendererLeft.setSize(window.innerWidth/2, window.innerHeight);

      window.setInterval(function(){
        rendererLeft.autoClear = false;
        rendererLeft.clear();

        rendererLeft.render(videoScene, videoCam);
        rendererLeft.render(scene, camera);
      }, 20);
    }
  }])

  //=======================================
  // RENDER RIGHT SIDE
  //=======================================
  .directive('webcamrightGl', [function() {

    return {
      restrict: 'E',
      link: function($scope, $element) {
        create($element[0]);
      }
    };

    function create(glFrame) {

      elementRight = rendererRight.domElement;
      containerRight = glFrame;
      containerRight.appendChild(elementRight);
      rendererRight.setSize(window.innerWidth/2, window.innerHeight);

      window.setInterval(function(){
        rendererRight.autoClear = false;
        rendererRight.clear();

        rendererRight.render(videoScene, videoCam);
        rendererRight.render(scene, camera);
      }, 20);
    }
  }]);
