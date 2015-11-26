var driveRobot = function(speed, direction)
{
    if(!speed || !drirection || isNaN(speed) || isNaN(direction)){
        console.log("no speed or direction given");
        return;
    }

    var makeRestPut = function(path, data) {
        $.ajax({
            url: "http://192.168.1.1:8000/" + path
            ,type: "PUT"
            ,data: JSON.stringify(data)
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

    requestDriveControl();
    setInterval(driveControl(driveData), 100);
};