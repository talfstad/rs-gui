define(["app", "apps/main/dashboard/dash_main/dash_view"], function(RipManager, DashView){
  RipManager.module("DashboardApp.Main", function(Main, RipManager, Backbone, Marionette, $, _){
    Main.Controller = {
      listDash: function(criterion){
        var dashListView = new DashView.Dash({});
        RipManager.mainLayout.mainRegion.show(dashListView);
      }
    }
  });

  return RipManager.DashboardApp.Main.Controller;
});