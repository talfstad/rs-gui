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

  RipManager.module("Routers.RipsApp", function(RipsAppRouter, RipManager, Backbone, Marionette, $, _){
    RipsAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "rips(/filter/criterion::criterion)": "listRips",
        "rips/:id": "showRip",
        "rips/:id/edit": "editRip"
      }
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
      },

      showRip: function(args){
        require(["apps/main/rips/show/show_controller"], function(ShowController){
          executeAction(ShowController.showRip, args);
        });
      },

      editRip: function(args){
        require(["apps/main/rips/edit/edit_controller"], function(EditController){
          executeAction(EditController.editRip, args);
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

    RipManager.on("rip:show", function(id){
      RipManager.navigate("rip/" + id);
      API.showRip(id);
    });

    RipManager.on("rip:edit", function(id){
      RipManager.navigate("rips/" + id + "/edit");
      API.editRip(id);
    });



    var authEnabledAPI = {
      listRips: function(criterion){
        checkAuth(API.listRips);
      },

      showRip: function(id){
        checkAuth(API.showRip);
      },

      editRip: function(id){
        checkAuth(API.editRip);
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
