define(["app", 
  "apps/main/main/main_controller",
  "apps/main/leftnav/leftnav_app",
  "authentication/authentication_app",
  "apps/main/rips/rips_app",
  "apps/main/dashboard/dashboard_app",
  "apps/main/offers/offers_app",
  "apps/main/registered/registered_app",
  "apps/main/landers/landers_app",
  "apps/main/earnings/earnings_app"], 

  function(RipManager, MainController){

  RipManager.module("MainApp", function(MainApp, RipManager, Backbone, Marionette, $, _){
    MainApp.startWithParent = false;
  });

  RipManager.module("Routers.MainApp", function(RipsAppRouter, RipManager, Backbone, Marionette, $, _){
    RipsAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "dash": "dash",
        "rips": "rips",
        "offers": "offers",
        "registered": "registered",
        "landers": "landers",
        "earnings": "earnings",
        "": "dash",
        ":notfound": "dash"
      }
    });

    var executeAction = function(action, arg){
      RipManager.startSubApp("MainApp");
      action(arg);
    };

        
    var checkMainViewRendered = function() {
      if(RipManager.mainLayout == undefined) {
        executeAction(MainController.loadMainApp);
      } else {
        if(RipManager.mainLayout.leftNavRegion == undefined)
          executeAction(MainController.loadMainApp);
      }
    };
    
    var checkAuth = function(callback, args) {
      RipManager.execute("authentication:check", callback, args);
    };

    var API = {
      rips: function(args){
        checkMainViewRendered();
        RipManager.trigger("rips:list");
      },

      ripReport: function(id){
        checkMainViewRendered();
        RipManager.trigger("rips:report", id);
      },
      dash: function(args){
        checkMainViewRendered();
        RipManager.trigger("dash:list");
        RipManager.navigate("dash");
      },
      offers: function(args){
        checkMainViewRendered();
        RipManager.trigger("offers:list");
        RipManager.navigate("offers");
      },
      registered: function(args){
        checkMainViewRendered();
        RipManager.trigger("registered:list");
        RipManager.navigate("registered");
      },
      landers: function(args){
        checkMainViewRendered();
        RipManager.trigger("landers:list");
        RipManager.navigate("landers");
      },
      earnings: function(args){
        checkMainViewRendered();
        RipManager.trigger("earnings:list");
        RipManager.navigate("earnings");
      }
    };

    RipManager.on("main:dash:list", function(){
      checkAuth(API.dash);
    });


    var authEnabledAPI = {
      rips: function(criterion){
        checkAuth(API.rips);
      },
      ripReport: function(criterion){
        checkAuth(API.ripReport, criterion);
      },
      dash: function(criterion){
        checkAuth(API.dash);
      },
      offers: function(criterion){
        checkAuth(API.offers);
      },
      registered: function(criterion){
        checkAuth(API.registered);
      },
      landers: function(criterion){
        checkAuth(API.landers);
      },
      earnings: function(criterion){
        checkAuth(API.earnings);
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
