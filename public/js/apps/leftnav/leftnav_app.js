define(["app", "apps/leftnav/list/list_controller"], function(RipManager, ListController){
  RipManager.module("LeftNavApp", function(LeftNav, RipManager, Backbone, Marionette, $, _){
    var API = {
      listLeftNav: function(){
        ListController.listLeftNav();
      }
    };

    LeftNav.on("start", function(){
      API.listLeftNav();
    });


    RipManager.on("leftnav:list", function() {
      API.listLeftNav();
    });


  });

  return RipManager.LeftNavApp;
});
