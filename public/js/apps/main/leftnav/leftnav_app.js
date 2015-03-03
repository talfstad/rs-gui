define(["app", "apps/main/leftnav/list/list_controller"], function(RipManager, ListController){
  RipManager.module("LeftNavApp", function(LeftNav, RipManager, Backbone, Marionette, $, _){
    var API = {
      listLeftNav: function(){
        ListController.listLeftNav();
      },
      selectCurrent: function(current){
        ListController.selectCurrent(current);
      }
    };

    RipManager.on("leftnav:list", function() {
      API.listLeftNav();
    });

    RipManager.on("leftnav:rips", function() {
      API.selectCurrent("rips");
    });

    


  });

  return RipManager.LeftNavApp;
});
