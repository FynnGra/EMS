/* ------------------------------------------------------------------ GLOBAL CONTROL ------------------------------------------------------------------ */

mRobot = {};
mRobot.control = {
    const: {
        interval: 100,
        timeout: 1000,
        maxD: 100,
        maxS: 100,
        ip: "192.168.0.11",
        port: "8000",
        token: "macio780"
    }
};

mRobot.control.variables = {
    batteryPercentage: 0
};

mRobot.control.makeRestPut = function (path, data) {
    return $.ajax({
        url: "http://" + mRobot.control.const.ip + ":" + mRobot.control.const.port + "/" + path
        , type: "PUT"
        , data: data
        , success: function () { console.log("REST PUT ", data, " to ", path); }
    });
};

mRobot.control.readBatteryPercentage = function () {
    var data =
    {
        token: mRobot.control.const.token
    };
    var response = mRobot.control.makeRestPut("getBatteryPercentage", data);

    response.done(function () {
        var batteryJSON = response.responseText;
        var batteryPercentage = JSON.parse(batteryJSON).batterypercentage;
        mRobot.control.variables.batteryPercentage = batteryPercentage;
    });
};

mRobot.control.requestAutoDrive = function () {
    var data =
    {
        token: mRobot.control.const.token,
        mode: "LINE_LEFT"
    };
    return mRobot.control.makeRestPut("requestAutoDrive", data);
};

mRobot.control.stopAutoDrive = function () {
    var data =
    {
        token: mRobot.control.const.token,
        mode: "IDLE"
    };
    return mRobot.control.makeRestPut("requestAutoDrive", data);
};

mRobot.control.requestDriveControl = function () {
    var data =
    {
        token: mRobot.control.const.token
    };
    return mRobot.control.makeRestPut("requestDriveControl", data);
};

mRobot.control.driveControl = function (driveData) {
    var data =
    {
        token: mRobot.control.const.token
        , speed: driveData.speed // <speed %, -100 - + 100>
        , direction: driveData.direction // <direction %, -100 - +100, +100 = turn left>
    };
    return mRobot.control.makeRestPut("driveControl", data);
};

mRobot.control.driveRobot = function (speed, direction) {
    var driveData = {};

    // trim speed - no bad values
    if (speed > mRobot.control.const.maxS) driveData.speed = mRobot.control.const.maxS;
    else if (speed < -mRobot.control.const.maxS) driveData.speed = -mRobot.control.const.maxS;
    else driveData.speed = speed;

    // trim direction - no bad values
    if (direction > mRobot.control.const.maxD) driveData.direction = mRobot.control.const.maxD;
    else if (direction < -mRobot.control.const.maxD) driveData.direction = -mRobot.control.const.maxD;
    else driveData.direction = direction;

    return mRobot.control.driveControl(driveData);
};

/* ---------------------------------------------------------------------------------------------------------------------------------------------------- */

mRobot.control.calculation = function (speedData, directionData) {
    // set current data
    directionData = directionData * 10 * (-1); // direction
    speedData = speedData * 10; // acceleration

    // cut high/low values
    if (directionData > 100) directionData = 100;
    if (speedData > 100) speedData = 100;
    if (directionData < -100) directionData = -100;
    if (speedData < -100) speedData = -100;

    var xValue = directionData;
    var yValue = speedData;

    // vector length
    var speedCalculated = Math.sqrt((xValue * xValue + (yValue * yValue)));
    if (yValue < 0) {
        speedCalculated *= -1;
    }

    // angle
    var directionCalculated = Math.atan(yValue / xValue) * (180 / Math.PI); // degrees

    // arcus correction
    if (xValue < 0) {
        directionCalculated += 180;
    } else if (yValue < 0 && xValue >= 0) {
        directionCalculated += 360;
    }

    // 0 degree start on positive y-axis
    if (directionCalculated > 270) {
        directionCalculated -= 270;
    } else {
        directionCalculated += 90;
    }

    // angle to direction
    if (directionCalculated < 80 && directionCalculated >= 0) {
        directionCalculated *= 1.25;
    } else if (directionCalculated > 100 && directionCalculated < 260) {
        directionCalculated = (directionCalculated - 180) * (-1.25);
    } else if (directionCalculated > 280) {
        directionCalculated = (directionCalculated - 360) * 1.25;
    } else if (directionCalculated >= 80 && directionCalculated <= 100) {
        directionCalculated = Math.abs((directionCalculated - 270)) * (-10);
        speedCalculated = (speedCalculated / 100) * directionCalculated;
    } else if (directionCalculated >= 260 && directionCalculated <= 280) {
        directionCalculated = Math.abs((directionCalculated - 270) * 10);
        speedCalculated = (speedCalculated / 100) * directionCalculated;
    }

    return {
        speed: speedCalculated,
        direction: directionCalculated
    }
};

/* ---------------------------------------------------------------------------------------------------------------------------------------------------- */

