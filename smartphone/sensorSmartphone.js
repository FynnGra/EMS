//Test Kram---------
$("#test").css({"background-color": "#042564", "font-size": "200%"});

var myVar;

var accX, accY, accZ;
var orientAlpha, orientBeta, orientGamma;
var orientAlphaBase, orientBetaBase, orientGammaBase;
var orientAlphaDiff, orientBetaDiff, orientGammaDiff;

//laufender Mittelwert
var pointer = 0;
var dataAlpha = [];
var dataBeta = [];
var offset = 20;

var putValue = function(alpha, beta){
    dataAlpha[pointer] = alpha;
    dataBeta[pointer] = beta;
    pointer ++;
    if(pointer >= (offset-1)) {
        pointer = 0;
    }
};

var getValue = function(array) {
    var sum = 0;

    for(var i = 0; i < (offset-1); i++) {
        sum = sum + array[i];
    }

    return sum/offset;
};

//Accelerometer Handler
function deviceMotionHandler(eventData) {

    accX = eventData.accelerationIncludingGravity.x;
    accY = eventData.accelerationIncludingGravity.y;
    accZ = eventData.accelerationIncludingGravity.z;

    $("#aX").html(eventData.acceleration.x);
    $("#aY").html(eventData.acceleration.y);
    $("#aZ").html(eventData.acceleration.z);

    $("#angX").html(accX);
    $("#angY").html(accY);
    $("#angZ").html(accZ);

    $("#rotX").html(eventData.rotationRate.alpha);
    $("#rotY").html(eventData.rotationRate.beta);
    $("#rotZ").html(eventData.rotationRate.gamma);

    //console.log("X: " + accX);

    //$("#sum").html($("#sum").innerHTML + eventData.accelerationIncludingGravity.x);

    //$("#sum").innerHTML = eventData.accelerationIncludingGravity.x.toString();
}

//Accelerometer registrieren
if (window.DeviceMotionEvent) {
    document.getElementById("xEvent").innerHTML = "Yes";
    window.addEventListener('devicemotion', deviceMotionHandler, false);
} else {
    document.getElementById("xEvent").innerHTML = "No"
}


//OrientationHandler
function deviceOrientationHandler(eventData) {
    orientAlpha = eventData.alpha;
    orientBeta = eventData.beta;
    orientGamma = eventData.gamma;

    putValue(orientAlpha, orientBeta);

    $("#LR").html(orientGamma);
    $("#FB").html(orientBeta);
    $("#DIR").html(orientAlpha);
}

//Reset Button for Orientation Base Values
function resetButton(){
    orientAlphaBase = orientAlpha;
    orientBetaBase = orientBeta;
    orientGammaBase = orientGamma;
    console.log("alphaBase: " + orientAlphaBase + " / gammaBase: " + orientGammaBase + " / betaBase: " + orientBetaBase);
}

function stopButton(){
    window.clearInterval(myVar);
    driveRobot(0,0);
    console.log("STOP");
}

function startButton(){
    requestDrive();
    console.log("START");
    myVar = setInterval(myTimer, 100);
}


//DeviceOrientationHandler registrieren
if (window.DeviceOrientationEvent) {
    console.log("DeviceOrientation is supported");
    $("#doEvent").html("Yes");
    window.addEventListener('deviceorientation', deviceOrientationHandler, false);
    document.getElementById("reset").addEventListener("click", resetButton);
    document.getElementById("stop").addEventListener("click", stopButton);
    document.getElementById("start").addEventListener("click", startButton);
} else {
    alert("DeviceOrientationEvent not supported on your device or browser");
    $("#doEvent").html("No");
}


// INTERVAL Beispiel

function myTimer(){
    console.log("alphaDiff: " + orientAlphaDiff + " / betaDiff: " + orientBetaDiff);

    //Speed?
    orientAlphaDiff = getValue(dataAlpha) - orientAlphaBase;
    //Richtung?
    orientBetaDiff = getValue(dataBeta) - orientBetaBase;

    //orientGammaDiff = orientGamma - orientGammaBase;
    driveRobot(orientAlphaDiff, orientBetaDiff);
}

// Interval entfernen
//window.clearInterval(myVar);

