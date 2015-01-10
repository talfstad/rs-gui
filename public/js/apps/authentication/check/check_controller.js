define(["app"], function(RipManager){
  RipManager.module("AuthenticationApp.Check", function(Check, RipManager, Backbone, Marionette, $, _){
    Check.Controller = {
      check: function(callback, args){
        require(["entities/authentication"], function(){
          //whether or not we're logged in
          var fetchingLoggedInStatus = RipManager.request("authentication:check:entity");

          $.when(fetchingLoggedInStatus).done(function(statusCollection){

            if(statusCollection.length == 1 && statusCollection.at(0).attributes.error) {
              RipManager.trigger("authentication:login");
            } else {
              callback(args);
            }
          });
        });
      }
    }
  });

  return RipManager.AuthenticationApp.Check.Controller;
});
