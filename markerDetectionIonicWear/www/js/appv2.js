/*
 * Authors: Tim Schauder & Finn Marquardt
 */


//=======================================
// INIT ANGULAR.JS AND IONIC
//=======================================

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      ionic.Platform.fullScreen();
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });




//=======================================
// COMMUNICATE WITH WEAR TEST
//=======================================



function watch(handle){
  var self = this;
  AndroidWear.onDataReceived(handle, function(e){
    self.dataReceived(e.data);
  });
  self.handle = handle;
}

watch.prototype = {
  dataReceived: function(data){
    app.logEvent("AndroidWear message received: " + data);
  },
  sendMessage: function(message){
    AndroidWear.sendData(this.handle, message);
    app.logEvent("AndroidWear message sent!");
  }
};



var app =
{
  watch: null,

  initialize: function(){ this.bindEvents(); },

  bindEvents: function()
  {
    var self = this;
    document.addEventListener(
      'deviceready',
      function(){ self.onDeviceReady(); },
      false);
  },

  onDeviceReady: function(){
    var self = this;
    self.receivedEvent('deviceready');
    if(AndroidWear)
    {
      AndroidWear.onConnect(function(e){
        self.logEvent("AndroidWear connection established");
        self.watch = new watch(e.handle);
      });
    }
    var sendButton = document.getElementById("sendMessage");
    sendButton.addEventListener("click", function(){
      if(self.watch){
        self.watch.sendMessage("Hello From Cordova!");
      }
    });
  },

  receivedEvent: function(id){
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');
    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');
    this.logEvent('Received Event: ' + id);
  },

  logEvent: function(message){
    var events = document.getElementById("events");
    var el = document.createElement("li");
    el.innerHTML = message;
    events.appendChild(el);
  }
};



app.initialize();


