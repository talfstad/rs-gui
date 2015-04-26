define(["app"], function(RipManager){
  RipManager.module("RegisteredApp", function(RegisteredApp, RipManager, Backbone, Marionette, $, _){
    RegisteredApp.startWithParent = false;

  });

  var executeAction = function(action, arg){
    RipManager.startSubApp("RegisteredApp");
    action(arg);
    RipManager.execute("set:active:header", "registered");
  };

  var checkAuth = function(callback, args) {
    require(["authentication/authentication_app"], function() {
      RipManager.execute("authentication:check", callback, args);
    });
  };

  var API = {
    listRegistered: function(args){
      require(["apps/main/registered/list/list_controller",
               "apps/main/leftnav/leftnav_app"], function(ListController){
        executeAction(ListController.listRegistered, args);
        RipManager.execute("set:active:leftnav", "registered");
      });
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

