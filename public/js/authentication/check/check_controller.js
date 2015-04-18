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
              RipManager.trigger("authentication:login");
            } else {
              RipManager.session.set({logged_in: true});
              if(statusCollection.models[0].attributes.user.admin) {
                RipManager.session.set({admin: true});
              }
              RipManager.session.set({username: statusCollection.models[0].attributes.user.username});
              callback(args);
            }
          });
        });
      }
    }
  });

  return RipManager.AuthenticationApp.Check.Controller;
});
