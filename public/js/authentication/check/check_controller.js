define(["app"], function(RipManager){
  RipManager.module("AuthenticationApp.Check", function(Check, RipManager, Backbone, Marionette, $, _){
    Check.Controller = {
      check: function(callback, args){
        require(["entities/authentication"], function(){

          //if user model logged_in is true then we're logged in, else we gotta check
          if(RipManager.session.get("logged_in")) {
            callback(args);
            return;
          }

          var fetchingLoggedInStatus = RipManager.request("authentication:check:entity");

          $.when(fetchingLoggedInStatus).done(function(statusCollection){

            if(statusCollection.length == 1 && statusCollection.at(0).attributes.error) {
              // RipManager.navigate("login", {trigger: true});
              RipManager.trigger("authentication:login");
            } else {
              RipManager.session.set({
                user: statusCollection.models[0].attributes.user.user,
                logged_in: true,
                username: statusCollection.models[0].attributes.user.username
              });

              if(statusCollection.models[0].attributes.user.admin) {
                RipManager.session.set({admin: true});
              }
              callback(args);
            }
          });
        });
      }
    }
  });

  return RipManager.AuthenticationApp.Check.Controller;
});
