var interval = 100, timeout = 1000, max = 10, ip = "192.168.0.11", port = "8000"; // CONST

var makeRestPut = function(path, data) {
    $.ajax({
        url: "http://" + ip + ":" + port + "/" + path
        ,type: "PUT"
        ,data: data
        ,success: function() { console.log("REST PUT ", data, " to ", path); }
    });
};

var requestDriveControl = function() {
    var data =
    {
        token: "macio780"
    };
    makeRestPut("requestDriveControl", data);
};

var driveControl = function(driveData) {
    var data =
    {
        token: "macio780"
        ,speed: driveData.speed // <speed %, -100 - + 100>
        ,direction: driveData.direction // <direction %, -100 - +100, +100 = turn left>
    };
    makeRestPut("driveControl", data);
};

var driveRobot = function(speed, direction)
{
    var driveData = {};

    // trim speed - no bad values
    if(speed > max) driveData.speed = max;
    else if(speed < -max) driveData.speed = -max;
    else driveData.speed = speed;

    // trim direction - no bad values
    if(direction > max) driveData.direction = max;
    else if(direction < -max) driveData.direction = -max;
    else driveData.direction = direction;

    driveControl(driveData);
};