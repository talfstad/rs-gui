define(["app"], function(RipManager){
  RipManager.module("RipsApp", function(RipsApp, RipManager, Backbone, Marionette, $, _){
    RipsApp.startWithParent = false;

    // RipsApp.onStart = function(){
    //   console.log("starting RipsApp");
    // };

    // RipsApp.onStop = function(){
    //   console.log("stopping RipsApp");
    // };
  });

  var executeAction = function(action, arg){
    RipManager.startSubApp("RipsApp");
    action(arg);
    RipManager.execute("set:active:header", "rips");
  };

  var checkAuth = function(callback, args) {
    require(["authentication/authentication_app"], function() {
      RipManager.execute("authentication:check", callback, args);
    });
  };

  var API = {
    listRips: function(args){
      require(["apps/main/rips/list/list_controller",
               "apps/main/leftnav/leftnav_app"], function(ListController){
        executeAction(ListController.listRips, args);
        RipManager.execute("set:active:leftnav", "rips");
        RipManager.navigate("rips");
      });
    },
    editRipSubmit: function(args){
      require(["apps/main/rips/edit/edit_controller"], function(EditController){
        executeAction(EditController.submitEdit, args);
      });
    }
  };

  RipManager.on("rips:list", function(){
    checkAuth(API.listRips);
  });

 
  var authEnabledAPI = {
    listRips: function(criterion){
      checkAuth(API.listRips);
    },

  
  };
});

