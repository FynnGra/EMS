//=======================================
// INIT ANGULAR.JS AND IONIC
//=======================================

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

  .run(function($ionicPlatform){
    $ionicPlatform.ready(function(){
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard){
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      ionic.Platform.fullScreen();
      if(window.StatusBar){
        StatusBar.styleDefault();
      }
    });
  });


//=======================================
// INIT WEAR CONNECTION
//=======================================

function watch(nodeId){
  var self = this;

  AndroidWear.onDataReceived(
    nodeId,
    function(message){ this.onDataReceivedHandler(message.data) }
  );
  self.nodeId = nodeId;
}

watch.prototype = {
  sendMessage: function(messageString){
    AndroidWear.sendData(this.nodeId, messageString);
  }
};

var watchConnection = {

      watch: null,

      initialize: function(){
        var self = this;
        document.addEventListener(
          'deviceready',
          function(){ self.onDeviceReady(); },
          false);
      },

      onDeviceReady: function(){
        var self = this;
        if(AndroidWear)
          AndroidWear.onConnect(
            function(message){ self.watch = new watch(message.handle); }
          );
      }

};

watchConnection.initialize();



//=======================================
// USAGE OF WEAR CONNECTION
//=======================================

// called when data arrives
var onDataReceivedHandler = function(messageString){
  alert("Message Received: " + messageString);
};

// to send messages: watchConnection.watch.sendMessage("myMessage");
document.addEventListener("deviceready", function(){

  document.getElementById("sendButton")
    .addEventListener("click", function(){
      if(watchConnection.watch){
        watchConnection.watch.sendMessage("Hello From Cordova!");
    }
  });

  document.getElementById("menu")
    .addEventListener("click", function(){
      if(watchConnection.watch){
        watchConnection.watch.sendMessage("menu");
      }
    });

  document.getElementById("joystick")
    .addEventListener("click", function(){
      if(watchConnection.watch){
        watchConnection.watch.sendMessage("joystick");
      }
    });

  document.getElementById("close")
    .addEventListener("click", function(){
      if(watchConnection.watch){
        watchConnection.watch.sendMessage("close");
      }
    });
});


