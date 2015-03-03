define(["app",
        "tpl!apps/main/main/main_layout.tpl"],
       function(RipManager, layoutTpl){
  RipManager.module("MainApp.View", function(View, RipManager, Backbone, Marionette, $, _){
    
    View.Layout = Marionette.LayoutView.extend({
      template: layoutTpl,

      regions: {
        leftNavRegion: "#left-nav-region",
        mainRegion: "#right-region"
      }
    });

  });

  return RipManager.MainApp.View;
});
