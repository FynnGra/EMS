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
// Camera for raycast
//var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);

videoScene.add(plane);
videoScene.add(videoCam);

crosshair = new THREE.Mesh(
  new THREE.RingGeometry( 0.02, 0.05, 32 ),
  new THREE.MeshBasicMaterial( {
    color: 0xFF0000,
    transparent: true,
    opacity: 0.5
  })
);
// Set circle
videoScene.add( crosshair );

// TESTAREA START
var textArray = [];
// create canvas
var canvasMode = document.createElement('canvas');
canvasMode.width = 550;
canvasMode.height = 300;

// draw the score of "mode" to the canvas
var contextMode = canvasMode.getContext('2d');
contextMode.font = "Bold 200px Helvetica";
contextMode.fillStyle = "rgba(255,255,255,0.95)";
contextMode.fillText('mode', 0, 300);

// use canvas contents as a texture
var textureMode = new THREE.Texture(canvasMode);
textureMode.needsUpdate = true;

var materialMode = new THREE.MeshBasicMaterial( {
  map: textureMode,
  transparent: true
} );

// Autotext
var canvasAuto = document.createElement('canvas');
canvasAuto.width = 1000;
canvasAuto.height = 500;

// draw the score of "mode" to the canvas
var contextAuto = canvasAuto.getContext('2d');
contextAuto.font = "Bold 200px Helvetica";
contextAuto.fillStyle = "rgba(255,255,255,0.95)";
contextAuto.fillText('auto', 0, 300);

// use canvas contents as a texture
var textureAuto = new THREE.Texture(canvasAuto);
textureAuto.needsUpdate = true;

var materialAuto = new THREE.MeshBasicMaterial( {
  map: textureAuto,
  transparent: true
} );

var canvasManuell = document.createElement('canvas');
canvasManuell.width = 1000;
canvasManuell.height = 500;

// draw the score of "mode" to the canvas
var contextManuell = canvasManuell.getContext('2d');
contextManuell.font = "Bold 200px Helvetica";
contextManuell.fillStyle = "rgba(255,255,255,0.95)";
contextManuell.fillText('manuell', 0, 300);

// use canvas contents as a texture
var textureManuell = new THREE.Texture(canvasManuell);
textureManuell.needsUpdate = true;

var materialManuell = new THREE.MeshBasicMaterial( {
  map: textureManuell,
  transparent: true
} );

var canvasCockpit = document.createElement('canvas');
canvasCockpit.width = 1000;
canvasCockpit.height = 500;

// draw the score of "mode" to the canvas
var contextCockpit = canvasCockpit.getContext('2d');
contextCockpit.font = "Bold 200px Helvetica";
contextCockpit.fillStyle = "rgba(255,255,255,0.95)";
contextCockpit.fillText('cockpit', 0, 300);

// use canvas contents as a texture
var textureCockpit = new THREE.Texture(canvasCockpit);
textureCockpit.needsUpdate = true;

var materialCockpit = new THREE.MeshBasicMaterial( {
  map: textureCockpit,
  transparent: true
} );

textArray.push(materialAuto);
textArray.push(materialManuell);
textArray.push(materialCockpit);
// TESTAREA END


//Array for the detected markers.
var markers = {};

var quantity = 3,
    position,
    selectPosition = (quantity - 3) * 35,
    selectCounter,
    selectedMode = 0;
//Array for the created cubes, not used so far
var objects = [];
//Textures for the created cubes
var textures = [];
var texture0 = THREE.ImageUtils.loadTexture("img/testjpg.jpg"),
    texture1 = THREE.ImageUtils.loadTexture("img/ionic.png"),
    texture2 = THREE.ImageUtils.loadTexture("img/testpng.png"),
    texture3 = THREE.ImageUtils.loadTexture("img/icon_battery_0.svg");

textures.push(texture0);
textures.push(texture1);
textures.push(texture2);
textures.push(texture3);

//State send by mRobot
var batteryCall = 0;

var batteryState = [];
var batteryTexture0 = THREE.ImageUtils.loadTexture("img/icon_battery_error.svg"),
    batteryTexture1 = THREE.ImageUtils.loadTexture("img/icon_battery_0.svg"),
    batteryTexture2 = THREE.ImageUtils.loadTexture("img/icon_battery_1.svg"),
    batteryTexture3 = THREE.ImageUtils.loadTexture("img/icon_battery_2.svg"),
    batteryTexture4 = THREE.ImageUtils.loadTexture("img/icon_battery_3.svg");

batteryState.push(batteryTexture0);
batteryState.push(batteryTexture1);
batteryState.push(batteryTexture2);
batteryState.push(batteryTexture3);
batteryState.push(batteryTexture4);

var selectionPics = [];
var selectionTexture0 = THREE.ImageUtils.loadTexture("img/icon_automatisch_inaktiv.svg"),
    selectionTexture3 = THREE.ImageUtils.loadTexture("img/icon_automatisch_selected.svg"),
    selectionTexture1 = THREE.ImageUtils.loadTexture("img/icon_manuell_inaktiv.svg"),
    selectionTexture4 = THREE.ImageUtils.loadTexture("img/icon_manuell_selected.svg"),
    selectionTexture2 = THREE.ImageUtils.loadTexture("img/icon_cockpit_inaktiv.svg"),
    selectionTexture5 = THREE.ImageUtils.loadTexture("img/icon_cockpit_aktiv.svg");

selectionPics.push(selectionTexture0);
selectionPics.push(selectionTexture1);
selectionPics.push(selectionTexture2);
selectionPics.push(selectionTexture3);
selectionPics.push(selectionTexture4);
selectionPics.push(selectionTexture5);

var select = new THREE.Mesh(
  new THREE.RingGeometry( 2, 5, 32 ),
  new THREE.MeshBasicMaterial({
    color: 0x00FF00
  }));
select.position.x = -60;

//TESTAREA START
document.onkeydown = function(e) {
  e = e || window.event;
  switch(e.which || e.keyCode) {
    case 38: // up
      if(selectCounter > 0) {
        select.position.y = selectPosition + 35;
        selectPosition = select.position.y;
        selectCounter--;
      }
      break;

    case 40: // down
      if(selectCounter < (quantity - 1)) {
        select.position.y = selectPosition - 35;
        selectPosition = select.position.y;
        selectCounter++;
      }
      break;

    case 13: // enter
      selectedMode = selectCounter;
      switch (selectCounter) {
        case 0:
          window.open('http://www.google.de', '_blank');
          break;
        case 1:
          window.open('http://www.duckduckgo.de', '_blank');
          break;
      }

    default: return; // exit this handler for other keys
  }
  // Doesn't work yet - fix if possible
  videoScene.matrixWorldNeedsUpdate = true;
  e.preventDefault(); // prevent the default action (scroll / move caret)
};
//TESTAREA END

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
      videoScene.add(crosshair);
      crosshair.material.color.setHex( 0xFF0000 );
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

      selectCounter = 0;
      if(quantity > 3) selectPosition = (quantity - 3) * 35;
      else if(quantity == 3) selectPosition = 35;
      else selectPosition = 0;

      m.model.matrixAutoUpdate = false;

      if(markers[0]) {
        var geometry = new THREE.BoxGeometry(100, 30, 1);

        for (var i = 0; i < quantity; i++) {
          if(selectedMode == i) var object = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 1), new THREE.MeshBasicMaterial({map: selectionPics[i+3], transparent: true}));
          else var object = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 1), new THREE.MeshBasicMaterial({map: selectionPics[i], transparent: true}));

          var objectBackground = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: 0.75}));

          var modeText = new THREE.Mesh(new THREE.BoxGeometry(30, 10, 1), materialMode);

          var specificText = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 1), textArray[i]);

          m.model.add(modeText);
          m.model.add(specificText);

          if (quantity % 2 == 0) {
            if (i == 0) position = 0;
            if (!((i + 1) % 2 == 0)) {
              object.position.y = position;
              objectBackground.position.y = position;
              modeText.position.y = position - 2;
              specificText.position.y = position + 2;
            }
            else {
              object.position.y = (-1) * position;
              objectBackground.position.y = (-1) * position;
              modeText.position.y = (-1) * position - 2;
              specificText.position.y = (-1) * position + 2;
            }
            if (!((i + 1) % 2 == 0)) position += 35;
          } else {
            if (i == 0) {
              object.position.y = 35;
              objectBackground.position.y = 35;
              modeText.position.y = 33;
              specificText.position.y = 37;
              position = 0;
            }
            else {
              if ((i + 1) % 2 == 0) {
                object.position.y = position;
                objectBackground.position.y = position;
                modeText.position.y = position - 2;
                specificText.position.y = position + 2;
              }
              else {
                object.position.y = (-1) * position;
                objectBackground.position.y = (-1) * position;
                modeText.position.y = (-1) * position - 2;
                specificText.position.y = (-1) * position + 2;
              }
              if ((i + 1) % 2 == 0) position += 35;
            }
          }
          // AXIS both x and y
          //object.lookAt(scene.position);
          modeText.position.x = 0;
          modeText.position.z = -22;
          specificText.position.x = 10;
          specificText.position.z = -24;
          object.position.x = -35;
          object.position.z = -20;
          objectBackground.position.z = -18;
          objects.push(object);
          m.model.add(objectBackground);
          m.model.add(object);
        }
        select.position.y = selectPosition;
        select.position.z = -15;
        selectCounter = 0;
        m.model.add(select);
        videoScene.remove(crosshair);
      }

      if(markers[64]){
        var batteryGeometry = new THREE.BoxGeometry(30, 80, 1);

        switch(batteryCall) {
          case 2:
            var batteryObject = new THREE.Mesh(batteryGeometry, new THREE.MeshBasicMaterial({map: batteryState[2]}));
            break;

          case 1:
            var batteryObject = new THREE.Mesh(batteryGeometry, new THREE.MeshBasicMaterial({map: batteryState[1]}));
            break;

          case 0: default:
            var batteryObject = new THREE.Mesh(batteryGeometry, new THREE.MeshBasicMaterial({map: batteryState[0],
              transparent: true}));
                break;
        }
        batteryObject.position.z = -20;
        m.model.add(batteryObject);
        crosshair.material.color.setHex( 0x00FF00 );
      }
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
