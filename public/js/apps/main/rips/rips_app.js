define(["app"], function(RipManager){
  RipManager.module("RipsApp", function(RipsApp, RipManager, Backbone, Marionette, $, _){
    RipsApp.startWithParent = false;

    RipsApp.onStart = function(){
      console.log("starting RipsApp");
    };

    RipsApp.onStop = function(){
      console.log("stopping RipsApp");
    };
  });

  var executeAction = function(action, arg){
    RipManager.startSubApp("RipsApp");
    action(arg);
    RipManager.execute("set:active:header", "rips");
  };

  var checkAuth = function(callback) {
    require(["authentication/authentication_app"], function() {
      RipManager.execute("authentication:check", callback);
    });
  };

  var API = {
    listRips: function(args){
      require(["apps/main/rips/list/list_controller"], function(ListController){
        executeAction(ListController.listRips, args);
        RipManager.navigate("rips");
      });
    }
  };

  RipManager.on("rips:list", function(){
    checkAuth(API.listRips);
  });

  RipManager.on("rips:filter", function(criterion){
    if(criterion){
      RipManager.navigate("rips/filter/criterion:" + criterion);
    }
    else{
      RipManager.navigate("rips");
    }
  });

  


  var authEnabledAPI = {
    listRips: function(criterion){
      checkAuth(API.listRips);
    },

  
  };
});

