var app = angular.module('starter', ['ionic', 'ngCordova']);

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        /*if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }*/
    });
});

app.controller('MotionController', function ($scope, $ionicPlatform, $cordovaDeviceMotion, $cordovaDeviceOrientation) {
    // watch Acceleration options
    $scope.options = {
        frequency: 200, // measure every 100ms
    };

    // current measurements
    $scope.measurements = {
        x: null, // tilt left, right on table
        y: null, // tilt left, right in front of face
        z: null, // tilt front, back
        mH: null, // magnetic heading
        tH: null // true heading
    }

    // current calculations
    $scope.calculations = {
        speed: null,
        angle: null
    }

    // info
    $scope.info = {
        battery: null
    };

    // Watcher object
    $scope.watchA = null; // acceleration sensor
    $scope.watchO = null; // orientation sensor

    var interval = 100, timeout = 1000, maxD = 100, maxS = 100, ip = "192.168.0.11", port = "8000"; // CONST

    var makeRestPut = function (path, data) {
        return $.ajax({
            url: "http://" + ip + ":" + port + "/" + path
            , type: "PUT"
            , data: data
            , success: function () { console.log("REST PUT ", data, " to ", path); }
        });
    };

    var getBatteryPercentage = function () {
        var data =
        {
            token: "macio780"
        };
        return makeRestPut("getBatteryPercentage", data);
    };

    var requestAutoDrive = function () {
        var data =
        {
            token: "macio780",
            mode: "LINE_LEFT"
        };
        return makeRestPut("requestAutoDrive", data);
    };

    var requestDriveControl = function () {
        var data =
        {
            token: "macio780"
        };
        makeRestPut("requestDriveControl", data);
    };

    var driveControl = function (driveData) {
        var data =
        {
            token: "macio780"
            , speed: driveData.speed // <speed %, -100 - + 100>
            , direction: driveData.direction // <direction %, -100 - +100, +100 = turn left>
        };
        makeRestPut("driveControl", data);
    };

    var driveRobot = function (speed, direction) {
        var driveData = {};

        // trim speed - no bad values
        if (speed > maxS) driveData.speed = maxS;
        else if (speed < -maxS) driveData.speed = -maxmaxS
        else driveData.speed = speed;

        // trim direction - no bad values
        if (direction > maxD) driveData.direction = maxD;
        else if (direction < -maxD) driveData.direction = -maxD;
        else driveData.direction = direction;

        driveControl(driveData);
    };

    // pointer for data array
    var pointer = 0;
    // data array
    var data = [];
    // offset for lenght of data array
    var offset = 20;
    // data getter
    var getData = function () {
        var sum = 0;

        for (var i = 0; i < (offset - 1) ; i++) {
            sum = sum + data[i];
        }

        return sum / offset;
    };

    // start measurements when Cordova device is ready
    $ionicPlatform.ready(function () {

        $scope.startWatching = function () {

            // device motion configuration
            $scope.watchA = $cordovaDeviceMotion.watchAcceleration($scope.options);
            // device heading configuration
            $scope.watchB = $cordovaDeviceOrientation.watchHeading($scope.options);

            requestDriveControl();

            // device motion initilaization
            $scope.watchA.then(null, function (error) {
                console.log('Error in motion initilaization');
            }, function (result) {

                // set current data  
                $scope.measurements.x = result.x;
                $scope.measurements.y = result.y * 10; // direction
                $scope.measurements.z = result.z * 10; // acceleration

                // cut high/low values
                if ($scope.measurements.y > 100) $scope.measurements.y = 100;
                if ($scope.measurements.z > 100) $scope.measurements.z = 100;
                if ($scope.measurements.y < -100) $scope.measurements.y = -100;
                if ($scope.measurements.z < -100) $scope.measurements.z = -100;
                // cut small values
                /*if (($scope.measurements.y > -10) && ($scope.measurements.y < 10)) {
                    $scope.measurements.y = 0;
                }*/
                /*if (($scope.measurements.z > -10) && ($scope.measurements.z < 10)) {
                    $scope.measurements.z = 0;
                }*/

                var x = $scope.measurements.y;
                var y = $scope.measurements.z;

                var calculations = function () {
                    var speed, angle;

                    //Vektorlänge
                    speed = Math.sqrt((x * x) + (y * y));
                    if (y < 0) {
                        speed *= -1;
                    }
                    //Winkel
                    angle = Math.atan(y / x) * (180 / Math.PI);
                    //Quadranten Korrektur wegen arcus
                    if (x < 0) {
                        angle += 180;
                    } else if (y < 0 && x >= 0) {
                        angle += 360;
                    }
                    // grad um 90 verschieben damit 0 grad auf ordinate

                    if (angle > 270) {
                        angle -= 270;
                    } else {
                        angle += 90;
                    }

                    console.log(angle);
                    //Winkel in Direction umrechnen
                    if (angle < 80 && angle >= 0) {
                        angle *= 1.25;
                    } else if (angle > 100 && angle < 260) {
                        angle = (angle - 180) * (-1.25);
                    } else if (angle > 280) {
                        angle = (angle - 360) * 1.25;
                    } else if (angle >= 80 && angle <= 100) {
                        angle = Math.abs((angle - 270))*(-10);
                        speed = (speed / 100) * angle;
                    } else if (angle >= 260 && angle <= 280) {
                        angle = Math.abs((angle - 270) * 10);
                        speed = (speed / 100) * angle;
                    }

                    return {
                        speed: speed,
                        angle: angle
                    }
                };
                var calc = calculations();
                $scope.calculations.speed = calc.speed;
                $scope.calculations.angle = calc.angle;

            });

            // device heading initilaization
            $scope.watchB.then(null, function (error) {
                console.log('Error in heading initilaization');
            }, function (result) {

                // Set current data  
                $scope.measurements.mH = result.magneticHeading;
                $scope.measurements.tH = result.trueHeading;

                pointer++;
                if (pointer >= (offset - 1)) {
                    pointer = 0;
                }

                //driveRobot($scope.measurements.z, $scope.measurements.y);

                driveRobot($scope.calculations.speed, $scope.calculations.angle);

                console.log(getBatteryPercentage());

                $scope.info.battery = getBatteryPercentage().responseText;

                //console.log(requestAutoDrive());

            });
        };

        $scope.stopWatching = function () {
            $scope.watchA.clearWatch(); // turn off motion detection watcher
            $scope.watchB.clearWatch(); // turn off heading detection watcher
        };
    });

    $scope.$on('$ionicView.beforeLeave', function () {
        $scope.watchA.clearWatch(); // turn off motion detection watcher
        $scope.watchB.clearWatch(); // turn off heading detection watcher
    });

});