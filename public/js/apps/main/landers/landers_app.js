define(["app"], function(RipManager){
  RipManager.module("LandersApp", function(LandersApp, RipManager, Backbone, Marionette, $, _){
    LandersApp.startWithParent = false;

  });

  var executeAction = function(action, arg){
    RipManager.startSubApp("LandersApp");
    action(arg);
  };

  var checkAuth = function(callback, args) {
    require(["authentication/authentication_app"], function() {
      RipManager.execute("authentication:check", callback, args);
    });
  };

  var API = {
    listLanders: function(args){
      require(["apps/main/landers/list/list_controller",
               "apps/main/leftnav/leftnav_app"], function(ListController){
        executeAction(ListController.listLanders, args);
        RipManager.execute("set:active:leftnav", "landers");
      });
    },
    addLander: function(args){
      require(["apps/main/landers/new/new_controller"], function(NewController){
        executeAction(NewController.addLander, args);
      });
    }
  };

  RipManager.on("landers:list", function(){
    checkAuth(API.listLanders);
  });

  RipManager.on("landers:new", function(){
    checkAuth(API.addLander);
  });
 
  var authEnabledAPI = {
    listLanders: function(criterion){
      checkAuth(API.listLanders);
    }
  };
});

