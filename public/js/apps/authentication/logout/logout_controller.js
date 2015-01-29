define(["app"], function(RipManager){
  RipManager.module("AuthenticationApp.Logout", function(Logout, RipManager, Backbone, Marionette, $, _){
    Logout.Controller = {
      logout: function(callback, args){
        require(["entities/authentication"], function(){
          
          //whether or not we're logged in
          var loggingOut = RipManager.request("authentication:logout:entity");

          $.when(loggingOut).done(function(logoutCollection){
            if(logoutCollection.at(0).attributes.success != "") {
              RipManager.session.set({logged_in: false});
              RipManager.trigger("authentication:login");
            }
          });
        });
      }
    };
  });
 return RipManager.AuthenticationApp.Logout.Controller;
});
