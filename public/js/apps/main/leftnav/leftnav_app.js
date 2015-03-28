define(["app", "apps/main/leftnav/list/list_controller"], function(RipManager, ListController){
  RipManager.module("LeftNavApp", function(LeftNav, RipManager, Backbone, Marionette, $, _){
    var API = {
      listLeftNav: function(){
        ListController.listLeftNav();
      },
     
    };

    RipManager.on("leftnav:list", function() {
      API.listLeftNav();
    });

    RipManager.commands.setHandler("set:active:leftnav", function(url){
      ListController.setActiveLeftNav(url);
    });
  });

  return RipManager.LeftNavApp;
});
