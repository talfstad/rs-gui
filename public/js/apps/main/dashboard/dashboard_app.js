define(["app"], function(RipManager){
  RipManager.module("DashboardApp", function(DashboardApp, RipManager, Backbone, Marionette, $, _){
    DashboardApp.startWithParent = false;

    DashboardApp.onStart = function(){
      console.log("starting DashboardApp");
    };

    DashboardApp.onStop = function(){
      console.log("stopping DashboardApp");
    };
  });

  var executeAction = function(action, arg){
    RipManager.startSubApp("DashboardApp");
    action(arg);
  };

  var checkAuth = function(callback) {
    require(["authentication/authentication_app"], function() {
      RipManager.execute("authentication:check", callback);
    });
  };

  var API = {
    listDash: function(args){
      require(["apps/main/dashboard/dash_main/dash_main_controller"], function(DashMainController){
        executeAction(DashMainController.listDash, args);
        RipManager.navigate("dash");
      });
    }
  };

  RipManager.on("dash:list", function(){
    checkAuth(API.listDash);
  });

  var authEnabledAPI = {
    listDash: function(criterion){
      checkAuth(API.listDash);
    }
  };
});

