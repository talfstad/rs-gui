define(["app", "apps/header/list/list_controller"], function(RipManager, ListController){
  RipManager.module("HeaderApp", function(Header, RipManager, Backbone, Marionette, $, _){
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
