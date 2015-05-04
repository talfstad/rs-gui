define(["app"], function(RipManager){
  RipManager.module("EarningsApp", function(EarningsApp, RipManager, Backbone, Marionette, $, _){
    EarningsApp.startWithParent = false;

  });

  var executeAction = function(action, arg){
    RipManager.startSubApp("EarningsApp");
    action(arg);
  };

  var checkAuth = function(callback, args) {
    require(["authentication/authentication_app"], function() {
      RipManager.execute("authentication:check", callback, args);
    });
  };

  var API = {
    listEarnings: function(args){
      require(["apps/main/earnings/list/list_controller",
               "apps/main/leftnav/leftnav_app"], function(ListController){
        executeAction(ListController.listEarnings, args);
        RipManager.execute("set:active:leftnav", "earnings");
      });
    }
  };

  RipManager.on("earnings:list", function(){
    checkAuth(API.listEarnings, {n:0});
  });

  RipManager.on("earnings:update", function(nDays){
    checkAuth(API.listEarnings, {n:nDays});
  });


  var authEnabledAPI = {
    listEarnings: function(criterion){
      checkAuth(API.listEarnings, {n:0});
    }
  };
});

