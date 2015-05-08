define(["app", 
        "apps/main/registered/list/list_controller",
        "apps/main/leftnav/leftnav_app",
        "authentication/authentication_app"], 
      function(RipManager, ListController){
  RipManager.module("RegisteredApp", function(RegisteredApp, RipManager, Backbone, Marionette, $, _){
    RegisteredApp.startWithParent = false;

  });

  var executeAction = function(action, arg){
    RipManager.startSubApp("RegisteredApp");
    action(arg);
  };

  var checkAuth = function(callback, args) {
    RipManager.execute("authentication:check", callback, args);
  };

  var API = {
    listRegistered: function(args){
      executeAction(ListController.listRegistered, args);
      RipManager.execute("set:active:leftnav", "registered");
    }
  };

  RipManager.on("registered:list", function(){
    checkAuth(API.listRegistered);
  });

  var authEnabledAPI = {
    listRegistered: function(criterion){
      checkAuth(API.listRegistered);
    }
  };
});

