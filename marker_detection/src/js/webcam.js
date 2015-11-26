/* 
 * Description: Small augmented reality application using WebRTC, JSARToolKit and THREE.js
 * 
 * Authors: Eduard Boitschenko & Fynn Grandke
 * Sources: http://www.html5rocks.com/en/tutorials/webgl/jsartoolkit_webrtc/
 *          http://www.html5rocks.com/en/tutorials/getusermedia/intro/
 *          https://github.com/kig/JSARToolKit
 *          http://threejs.org/docs/
 */

/*global THREE */

threshold = 128;
DEBUG = false;                                  //TRUE: show debugging tracking stream.

var video = document.createElement('video');    //create <video> tag for webcam stream

var width = 640;                                //width of canvas/video stream
var height = 480;                               //height of canvas/video stream
var canvas = null;                              //global canvas for rendering the frames

var detector = null;                            //marker detector object
var raster = null;                              //raster object
var resultMat = null;                           //the matrix we get from the JSARToolkit and pass to our x3dom scene



//Initialize video
video.width = width;    
video.height = height;
video.loop = true;
video.autoplay = true;
video.controls = true;

//Checking for browser vendor prefixes.
navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

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


window.onload = function()
{
    //document.body.appendChild(video);

    //Will hold the video frames on which the JSARToolKit raster object operates.
    var canvas = document.createElement('canvas');          
    canvas.width = 320;
    canvas.height = 240;
    
    //For debugging purpose.
    var debugCanvas = document.createElement('canvas');
    debugCanvas.id = 'debugCanvas';
    debugCanvas.width = 320;
    debugCanvas.height = 240;

    var videoCanvas = document.createElement('canvas');
    videoCanvas.width = video.width;
    videoCanvas.height = video.height;
    
    // Create a RGB raster object for the 2D canvas.
    // JSARToolKit uses raster objects to read image data.
    // Note that you need to set canvas.changed = true on every frame.
    var raster = new NyARRgbRaster_Canvas2D(canvas);

    // FLARParam is the thing used by FLARToolKit to set camera parameters.
    // Here we create a FLARParam for images with 320x240 pixel dimensions.
    var param = new FLARParam(320, 240);
    
    // Create a NyARTransMatResult object for getting the marker translation matrices.
    var resultMat = new NyARTransMatResult();
    
    // The FLARMultiIdMarkerDetector is the actual detection engine for marker detection.
    // It detects multiple ID markers. ID markers are special markers that encode a number.
    var detector = new FLARMultiIdMarkerDetector(param, 120);

    // For tracking video set continue mode to true. In continue mode, the detector
    // tracks markers across multiple frames.
    detector.setContinueMode(true);
    
    var ctx = canvas.getContext('2d');
    ctx.font = "24px URW Gothic L, Arial, Sans-serif";
    
    // glMatrix matrices are flat arrays.
    var tmp = new Float32Array(16);

    //Get an instance of the WebGLRenderer and configure it.
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(960, 720);

    var glCanvas = renderer.domElement;
    glCanvas.id = 'glCanvas';
    document.body.appendChild(glCanvas);
    glCanvas.style.display = "block";
    glCanvas.style.margin = "auto";
    
    //Create a scene and define light parameters.
    var scene = new THREE.Scene();
    var light = new THREE.PointLight(0xffffff);
    light.position.set(400, 500, 100);
    scene.add(light);
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-400, -500, -100);
    scene.add(light);
    
    
    // Create a camera object for your Three.js scene.
    var camera = new THREE.Camera();
    scene.add(camera);
    
    // Next we need to make the Three.js camera use the FLARParam matrix.
    param.copyCameraMatrix(tmp, 10, 10000);
    camera.projectionMatrix.setFromArray(tmp);

    // To display the video, first create a texture from it.
    var videoTex = new THREE.Texture(video);
    videoTex.minFilter = THREE.NearestFilter;

    // Then create a plane textured with the video.
    var plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2, 0),
      new THREE.MeshBasicMaterial({map: videoTex})
    );
    
    // The video plane shouldn't care about the z-buffer.
    plane.material.depthTest = false;
    plane.material.depthWrite = false;
    
    // Create a camera and a scene for the video plane and
    // add the camera and the video plane to the scene.
    var videoCam = new THREE.Camera();
    var videoScene = new THREE.Scene();
    videoScene.add(plane);
    videoScene.add(videoCam);
    
    
    var markers = {};
    var lastTime = 0;
    

    window.setInterval(function()
    {
        if (video.ended) video.play();
        if (video.paused) return;
        if (window.paused) return;
        if (video.currentTime === video.duration) {
          video.currentTime = 0;
        }
        if (video.currentTime === lastTime) return;
        lastTime = video.currentTime;
        
        // Draw the video frame to the canvas.
        videoCanvas.getContext('2d').drawImage(video, 0, 0);
        ctx.drawImage(videoCanvas, 0, 0, 320, 240);

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
              }
            }
            if (!markers[currId]) {
              markers[currId] = {};
            }
          
          // Get the transformation matrix for the detected marker.
          detector.getTransformMatrix(idx, resultMat);
          
          markers[currId].age = 0;
          
          // Copy the result matrix into our marker tracker object.
          markers[currId].transform = Object.asCopy(resultMat);
        }
        
        for (var i in markers)
        {   
            var r = markers[i];
            if (r.age > 1) {
                delete markers[i];
                scene.remove(r.model);
            }
            r.age++;
        }
        
        //Add a cube 3D object for each detected marker.
        for (var i in markers)
        {
        var m = markers[i];
        if (!m.model) {
            m.model = new THREE.Object3D();
            var cube = new THREE.Mesh(
              new THREE.BoxGeometry(100,100,100),
              new THREE.MeshBasicMaterial({color: 0x00CCFF}));
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
        
        // Render the scene.
        renderer.autoClear = false;
        renderer.clear();
        renderer.render(videoScene, videoCam);
        renderer.render(scene, camera);
        
    }, 15);     //Call function every 15ms.
    
};

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