define(["app","apps/main/rips/rips_app", "apps/main/leftnav/list/list_view", "apps/main/main/main_view"], function(RipManager, RipsApp, LeftNavView, MainLayout){
  RipManager.module("RipsApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      loadMainApp: function(criterion){
        require(["entities/rip", "apps/main/leftnav/list/list_view", "apps/main/dashboard/dashboard_app"], function(){
          var leftNav = new LeftNavView.LeftNav();
          
          RipManager.mainLayout = new MainLayout.Layout();
          RipManager.mainLayout.render();

          RipManager.mainRegion.show(RipManager.mainLayout);
          RipManager.mainLayout.leftNavRegion.show(leftNav);
        });
      }
    }
  });

  return RipManager.RipsApp.List.Controller;
});