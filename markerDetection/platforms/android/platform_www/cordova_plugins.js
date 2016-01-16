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
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "net.trentgardner.cordova.androidwear": "0.0.3",
    "cordova-plugin-splashscreen": "3.0.0",
    "cordova-plugin-inappbrowser": "1.1.1"
}
// BOTTOM OF METADATA
});