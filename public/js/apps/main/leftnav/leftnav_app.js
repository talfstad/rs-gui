define(["app", "apps/leftnav/list/list_controller"], function(RipManager, ListController){
  RipManager.module("LeftNavApp", function(LeftNav, RipManager, Backbone, Marionette, $, _){
    var API = {
      listLeftNav: function(){
        ListController.listLeftNav();
      }
    };

    RipManager.on("leftnav:list", function() {
      API.listLeftNav();
    });


  });

  return RipManager.LeftNavApp;
});
