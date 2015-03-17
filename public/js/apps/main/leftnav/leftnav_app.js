define(["app", "apps/main/leftnav/list/list_controller"], function(RipManager, ListController){
  RipManager.module("LeftNavApp", function(LeftNav, RipManager, Backbone, Marionette, $, _){
    var API = {
      listLeftNav: function(){
        ListController.listLeftNav();
      },
      selectCurrent: function(current){
        ListController.setActiveLeftNav(current);
      }
    };

    RipManager.on("leftnav:list", function() {
      API.listLeftNav();
    });

    RipManager.on("leftnav:rips", function() {
      API.selectCurrent("rips");
    });

    RipManager.commands.setHandler("set:active:leftnav", function(name){
      ListController.setActiveLeftNav(name);
    });
  });

  return RipManager.LeftNavApp;
});
