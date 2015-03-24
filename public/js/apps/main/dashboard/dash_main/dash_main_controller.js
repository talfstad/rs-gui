define(["app", "apps/main/dashboard/dash_main/dash_view"], function(RipManager, DashView){
  RipManager.module("DashboardApp.Main", function(Main, RipManager, Backbone, Marionette, $, _){
    Main.Controller = {
      
        listDash: function(criterion){
          require(["common/loading_view", "apps/main/dashboard/models/overview_stats_model","apps/main/dashboard/models/overview_graph_model"], function(LoadingView){
            var numbersWithCommas = function(number) {
              return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            // var DashLayout = new DashListView.DashListLayout();
            // DashLayout.render();

            // RipManager.mainLayout.mainRegion.show(DashLayout);

            //show loading
            var loadingView = new LoadingView.Loading();
            RipManager.mainLayout.mainRegion.show(loadingView);

            //get the overview data
            var fetchingOverviewStats = RipManager.request("dashboard:overviewStats");

            $.when(fetchingOverviewStats).done(function(model){
              $.each(model.models[0].attributes, function(index, value){
                model.models[0].attributes[index] = numbersWithCommas(value);
              });
              
              //get the total ripped hits model
              var totalRippedHitsGraph = RipManager.request("dashboard:totalRippedHitsGraph");
              
              $.when(totalRippedHitsGraph).done(function(totalRippedHitsData){
                
                var dashListView = new DashView.Dash({
                  overViewStatsModel: model.models[0].attributes,
                  totalRippedHitsGraph: totalRippedHitsData.models
                });

                RipManager.mainLayout.mainRegion.show(dashListView);

              });

            });
          });
        }
    }
  });

  return RipManager.DashboardApp.Main.Controller;
});