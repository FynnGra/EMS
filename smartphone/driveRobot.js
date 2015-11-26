var driveRobot = function(speed, direction)
{
    var makeRestPut = function(path, data) {
        console.log("REST JSON: ", JSON.stringify(data));

        $.ajax({
            url: "http://192.168.0.11:8000/" + path
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

    var driveData = {};

    // trim speed - no bad values
    if(speed > 100) driveData.speed = 100;
    else if(speed < -100) driveData.speed = -100;
    else driveData.speed = speed;

    // trim direction - no bad values
    if(direction > 100) driveData.direction = 100;
    else if(direction < -100) driveData.direction = -100;
    else driveData.direction = direction;

    requestDriveControl(); // call once to change mode

    var interval = 100, timeout = 2000;
    var drive = setInterval(function(){driveControl(driveData)}, interval); // drive every X ms
    setTimeout(function(){ clearInterval(drive) }, timeout); // stop driving after X ms
};