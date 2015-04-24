define(["app"], function(RipManager){
  RipManager.module("MainApp", function(MainApp, RipManager, Backbone, Marionette, $, _){
    MainApp.startWithParent = false;

    // MainApp.onStart = function(){
    //   console.log("starting MainApp");
    // };

    // MainApp.onStop = function(){
    //   console.log("stopping MainApp");
    // };
  });

  RipManager.module("Routers.MainApp", function(RipsAppRouter, RipManager, Backbone, Marionette, $, _){
    RipsAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        // "rips(/filter/criterion::criterion)": "listDash",
        "dash": "dash",
        "rips": "rips",
        "offers": "offers",
        "registered": 'registered',
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
    
    var checkAuth = function(callback, args) {
      require(["authentication/authentication_app"], function() {
        RipManager.execute("authentication:check", callback, args);
      });
    };

    var API = {
      rips: function(args){
        require(["apps/main/rips/rips_app", "apps/main/leftnav/leftnav_app"], function(){
          checkMainViewRendered();
          RipManager.trigger("leftnav:rips");
          RipManager.trigger("rips:list");
        });
      },

      ripReport: function(id){
        require(["apps/main/rips/rips_app", "apps/main/leftnav/leftnav_app"], function(){
          checkMainViewRendered();
          RipManager.trigger("leftnav:rips");
          RipManager.trigger("rips:report", id);
        });
      },
      dash: function(args){
        require(["apps/main/dashboard/dashboard_app", "apps/main/leftnav/leftnav_app"], function(){
          checkMainViewRendered();
          RipManager.trigger("leftnav:rips");
          RipManager.trigger("dash:list");
        });
      },
      offers: function(args){
        require(["apps/main/offers/offers_app", "apps/main/leftnav/leftnav_app"], function(){
          checkMainViewRendered();
          RipManager.trigger("leftnav:offers");
          RipManager.trigger("offers:list");
        });
      },
      registered: function(args){
        require(["apps/main/registered/registered_app", "apps/main/leftnav/leftnav_app"], function(){
          checkMainViewRendered();
          RipManager.trigger("leftnav:offers");
          RipManager.trigger("registered:list");
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
