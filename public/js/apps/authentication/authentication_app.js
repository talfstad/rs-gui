define(["app"], function(RipManager){
  RipManager.module("AuthenticationApp", function(AuthenticationApp, RipManager, Backbone, Marionette, $, _){
    AuthenticationApp.startWithParent = false;

    AuthenticationApp.onStart = function(){
      console.log("starting AuthenticationApp");
    };

    AuthenticationApp.onStop = function(){
      console.log("stopping AuthenticationApp");
    };
  });

  RipManager.module("Routers.AuthenticationApp", function(AuthenticationAppRouter, RipManager, Backbone, Marionette, $, _){
    AuthenticationAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "login": "login",
        "logout": "logout",
      }
    });

    
    var checkAuth = function(callback) {
      require(["apps/authentication/authentication_app"], function() {
        RipManager.execute("authentication:check", callback);
      });
    };

    var executeAction = function(action, arg){
      RipManager.startSubApp("AuthenticationApp");
      action(arg);
      //RipManager.execute("set:active:header", "login");
    };

    var API = {
      login: function(criterion){
        require(["apps/authentication/login/login_controller"], function(LoginController){
          executeAction(LoginController.login, criterion);
        });
      },

      logout: function(id){
        require(["apps/authentication/logout/logout_controller"], function(LogoutController){
          executeAction(LogoutController.logout, criterion);
        });
      }
    };

    RipManager.on("authentication:login", function(callback){
      RipManager.navigate("login");
      API.login();
    });

    RipManager.on("authentication:logout", function(callback){
      checkAuth(API.logout);
    });

    var check = function(callback){
      require(["apps/authentication/check/check_controller"], function(CheckController){
        CheckController.check(callback);
      });
    };

    RipManager.commands.setHandler("authentication:check", function(callback){
      check(callback);
    });


    var authEnabledAPI = {
      login: function(criterion){
        checkAuth(API.login);
      },

      logout: function(id){
        require(["apps/authentication/logout/logout_controller"], function(LogoutController){
          checkAuth(API.logout);
        });
      }
    };


    RipManager.addInitializer(function(){
      new AuthenticationAppRouter.Router({
        controller: authEnabledAPI
      });
    });


  });

  return RipManager.AuthenticationAppRouter;
});
