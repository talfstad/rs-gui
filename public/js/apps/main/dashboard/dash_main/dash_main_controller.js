define(["app", "apps/main/dashboard/dash_main/dash_view"], function(RipManager, DashView){
  RipManager.module("DashboardApp.Main", function(Main, RipManager, Backbone, Marionette, $, _){
    Main.Controller = {
      
        listDash: function(criterion){
          require(["apps/main/dashboard/models/overview_stats_model"], function(){
            var numbersWithCommas = function(number) {
              return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            var fetchingOverviewStats = RipManager.request("dashboard:overviewStats");

            $.when(fetchingOverviewStats).done(function(model){
              $.each(model.models[0].attributes, function(index, value){
                model.models[0].attributes[index] = numbersWithCommas(value);
              });
              var dashListView = new DashView.Dash({
                overViewStatsModel: model.models[0].attributes
              });

              RipManager.mainLayout.mainRegion.show(dashListView);

            });
          });
        }
    }
  });

  return RipManager.DashboardApp.Main.Controller;
});