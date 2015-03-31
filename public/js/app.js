define(["marionette", "authentication/session/user_model"], function(Marionette, UserModel){
  var RipManager = new Marionette.Application();

  RipManager.addRegions({
    headerRegion: "#header-region",
    mainRegion: "#main-region",
  });

  RipManager.navigate = function(route,  options){
    options || (options = {});
    Backbone.history.navigate(route, options);
  };

  RipManager.getCurrentRoute = function(){
    return Backbone.history.fragment
  };

  //Globals needed to maintain state of things
  RipManager.session = new UserModel({});
  
  RipManager.startSubApp = function(appName, args){
    var currentApp = appName ? RipManager.module(appName) : null;
    if (RipManager.currentApp === currentApp){ return; }

    if (RipManager.currentApp){
      RipManager.currentApp.stop();
    }

    RipManager.currentApp = currentApp;
    if(currentApp){
      currentApp.start(args);
    }
  };

  RipManager.on("start", function(){
    if(Backbone.history){
      require([
        "apps/main/main/main_app",
        "authentication/authentication_app"], function () {
        
      if(history.pushState) {
        Backbone.history.start({
          pushState: true
        });
      } else {
        Backbone.history.start({
          pushState: false
        });
      }

        //CSRF Protection here. Adding to all calls as a prefilter
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
          var token;
          options.xhrFields = {
            withCredentials: true
          };
          token = $('meta[name="csrf-token"]').attr('content');
          if (token) {
            return jqXHR.setRequestHeader('X-CSRF-Token', token);
          }
        });


        if(RipManager.getCurrentRoute() === ""){
          RipManager.trigger("main:load");
        }
      
      });
    }
  });

  return RipManager;
});
