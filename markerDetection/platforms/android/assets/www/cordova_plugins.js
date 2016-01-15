cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/net.trentgardner.cordova.androidwear/www/androidwear.js",
        "id": "net.trentgardner.cordova.androidwear.AndroidWear",
        "pluginId": "net.trentgardner.cordova.androidwear",
        "clobbers": [
            "AndroidWear"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "net.trentgardner.cordova.androidwear": "0.0.3",
    "cordova-plugin-splashscreen": "3.0.0"
}
// BOTTOM OF METADATA
});