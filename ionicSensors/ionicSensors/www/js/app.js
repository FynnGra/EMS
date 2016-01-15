var app = angular.module('starter', ['ionic', 'ngCordova']);

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {

    });
});

app.controller('MotionController', function ($scope, $ionicPlatform, $cordovaDeviceMotion, $cordovaDeviceOrientation) {

    // watch acceleration options
    $scope.options = {
        frequency: 200, // measure every 100ms
    };

    // current measurements
    $scope.measurements = {
        y: null, // tilt left, right in front of face
        z: null, // tilt front, back
    }

    // current calculations
    $scope.calculations = {
        speed: null,
        direction: null
    }

    // info
    $scope.info = {
        battery: null
    };

    // watcher object
    $scope.watch = null; // acceleration sensor

    // start measurements when Cordova device is ready
    $ionicPlatform.ready(function () {

        $scope.startWatching = function () {

            // device motion configuration
            $scope.watch = $cordovaDeviceMotion.watchAcceleration($scope.options);

            mRobot.control.requestDriveControl();

            // device motion initilaization
            $scope.watch.then(null, function (error) {
                console.log('Error in motion initilaization');
            }, function (result) {

                mRobot.control.readBatteryPercentage();
                var calc = mRobot.control.calculation(result.z, result.y);
                mRobot.control.driveRobot(calc.speed, calc.direction);

                // set current data to visualisation
                $scope.measurements.y = result.y.toFixed(2); // direction
                $scope.measurements.z = result.z.toFixed(2); // acceleration
                $scope.calculations.speed = calc.speed.toFixed(2);
                $scope.calculations.direction = calc.direction.toFixed(2);
                $scope.info.battery = mRobot.control.variables.batteryPercentage;

                console.log(mRobot.control.variables.batteryPercentage);

            });
        };

        $scope.stopWatching = function () {
            $scope.watch.clearWatch(); // turn off motion detection watcher
        };

        $scope.startAutoDrive = function () {
            mRobot.control.requestAutoDrive();
        };

        $scope.stopAutoDrive = function () {
            mRobot.control.stopAutoDrive();
        };
    });

    $scope.$on('$ionicView.beforeLeave', function () {
        $scope.watch.clearWatch(); // turn off motion detection watcher
    });

});