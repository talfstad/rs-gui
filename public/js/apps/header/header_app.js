define(["app", "apps/header/list/list_controller"], function(RipManager, ListController){
  RipManager.module("HeaderApp", function(Header, RipManager, Backbone, Marionette, $, _){

    var executeAction = function(action, arg){
      RipManager.startSubApp("HeaderApp");
      action(arg);
      // RipManager.execute("set:active:header", "offers");
    };

    // var checkAuth = function(callback, args) {
    //   require(["authentication/authentication_app"], function() {
    //     RipManager.trigger("authentication:check", callback, args);
    //   });
    // };


    var API = {
      listHeader: function(){
        ListController.listHeader();
      }
    };

    // RipManager.commands.setHandler("set:active:header", function(name){
    //   ListController.setActiveHeader(name);
    // });

    Header.on("start", function(){
      API.listHeader();
    });
  });

  return RipManager.HeaderApp;
});
