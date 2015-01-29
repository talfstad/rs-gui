define(["marionette", "apps/authentication/session/user_model","apps/config/marionette/regions/dialog"], function(Marionette, UserModel){
  var RipManager = new Marionette.Application();

  RipManager.addRegions({
    headerRegion: "#header-region",
    mainRegion: "#main-region",
    dialogRegion: Marionette.Region.Dialog.extend({
      el: "#dialog-region"
    })
  });

  RipManager.navigate = function(route,  options){
    options || (options = {});
    Backbone.history.navigate(route, options);
  };

  RipManager.getCurrentRoute = function(){
    return Backbone.history.fragment
  };

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
        "apps/rips/rips_app", 
        "apps/about/about_app", 
        "apps/authentication/authentication_app"], function () {
        
        Backbone.history.start();

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
          RipManager.trigger("rips:list");
        }
      
      });
    }
  });

  return RipManager;
});
