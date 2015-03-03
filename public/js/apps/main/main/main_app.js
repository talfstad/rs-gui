define(["app"], function(RipManager){
  RipManager.module("MainApp", function(MainApp, RipManager, Backbone, Marionette, $, _){
    MainApp.startWithParent = false;

    MainApp.onStart = function(){
      console.log("starting MainApp");
    };

    MainApp.onStop = function(){
      console.log("stopping MainApp");
    };
  });

  RipManager.module("Routers.MainApp", function(RipsAppRouter, RipManager, Backbone, Marionette, $, _){
    RipsAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        // "rips(/filter/criterion::criterion)": "listDash",
        "dash": "dash",
        "rips": "rips",
        "": "dash",
        ":notfound": "dash"
      }
    });

    var executeAction = function(action, arg){
      RipManager.startSubApp("MainApp");
      action(arg);
    };

        
    var checkMainViewRendered = function() {
      require(["apps/main/main/main_controller"], function(MainController){
        if(RipManager.mainLayout == undefined) {
          executeAction(MainController.loadMainApp);
        } else {
          if(RipManager.mainLayout.leftNavRegion == undefined)
            executeAction(MainController.loadMainApp);
        }
      });
    };
    

    var checkAuth = function(callback){
      require(["authentication/authentication_app"], function() {
        RipManager.execute("authentication:check", callback);
      });
    };

    var API = {
      
      rips: function(args){
        require(["apps/main/rips/rips_app"], function(){
          checkMainViewRendered();
          RipManager.trigger("rips:list");
        });
      },
      dash: function(args){
        require(["apps/main/dashboard/dashboard_app"], function(){
          checkMainViewRendered();
          RipManager.trigger("dash:list");
        });
      }
    };

    RipManager.on("main:dash:list", function(){
      checkAuth(API.dash);
    });


    var authEnabledAPI = {
      rips: function(criterion){
          checkAuth(API.rips);
      },
      dash: function(criterion){
        checkAuth(API.dash);
      }
    };

    RipManager.addInitializer(function(){
      new RipsAppRouter.Router({
        controller: authEnabledAPI
      });
    });
  });

  return RipManager.RipsAppRouter;
});
