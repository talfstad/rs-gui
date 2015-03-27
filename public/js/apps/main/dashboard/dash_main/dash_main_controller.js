define(["app", "apps/main/dashboard/dash_main/dash_view"], function(RipManager, DashView){
  RipManager.module("DashboardApp.Main", function(Main, RipManager, Backbone, Marionette, $, _){
    Main.Controller = {
      
        listDash: function(criterion){
          require(["common/loading_view", "apps/main/dashboard/models/overview_stats_model","apps/main/dashboard/models/overview_graph_model",
            "bootstrap"], function(LoadingView){
            var numbersWithCommas = function(number) {
              return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            var DashLayout = new DashView.DashListLayout();
            DashLayout.render();

            RipManager.mainLayout.mainRegion.show(DashLayout);

            //show loading
            var loadingView = new LoadingView.Loading();

            DashLayout.overviewStat1Region.show(loadingView);
            DashLayout.overviewStat2Region.show(loadingView);
            DashLayout.overviewStat3Region.show(loadingView);
            DashLayout.overviewStat4Region.show(loadingView);

            DashLayout.overviewStatsGraph.show(loadingView);


            //get data
            var fetchingOverviewStats = RipManager.request("dashboard:overviewStats");
            var totalRippedHitsGraph = RipManager.request("dashboard:totalRippedHitsGraph");
            var totalJacksGraph = RipManager.request("dashboard:totalJacksGraph");


            //got data
            $.when(fetchingOverviewStats).done(function(model){
              //format the data with commas for thousands, etc.
              $.each(model.models[0].attributes, function(index, value){
                model.models[0].attributes[index] = numbersWithCommas(value);
              });

              //create views
              var dailyRippedHitsView = new DashView.OverviewDailyStatItem({
                value: model.models[0].attributes.total_daily_ripped_hits,
                color: "bg-aqua",
                icon: "ion ion-stats-bars",
                title: "Ripped Hits Today"
              });

              var dailyReplacementOffersView = new DashView.OverviewDailyStatItem({
                value: model.models[0].attributes.total_daily_jacks,
                color: "bg-yellow",
                icon: "ion ion-social-usd",
                title: "Replacement Offers Shown"
              });

              var dailyRipsView = new DashView.OverviewDailyStatItem({
                value: model.models[0].attributes.total_daily_rips,
                color: "bg-red",
                icon: "ion ion-person-add",
                title: "Rips Today"
              });

              var dailyRegisteredUserHitsView = new DashView.OverviewDailyStatItem({
                value: model.models[0].attributes.total_daily_registered_hits,
                color: "bg-green",
                icon: "ion ion-pie-graph",
                title: "Registered User Hits Today"
              });

              //show

              try {
                DashLayout.overviewStat1Region.show(dailyRippedHitsView);
                DashLayout.overviewStat2Region.show(dailyReplacementOffersView);
                DashLayout.overviewStat3Region.show(dailyRipsView);
                DashLayout.overviewStat4Region.show(dailyRegisteredUserHitsView);
              } catch(e){}
              
            });

            
            $.when(totalRippedHitsGraph).done(function(totalRippedHitsData){
              $.when(totalJacksGraph).done(function(totalJacksGraphData){
                //create view
                var overviewStatsGraph = new DashView.overviewStatsGraph({
                  totalRippedHitsGraph: totalRippedHitsData.models,
                  totalJacksGraph: totalJacksGraphData.models
                });
            
                //show
                try {
                  DashLayout.overviewStatsGraph.show(overviewStatsGraph);
                } catch(e){}
              });
            });

            
          });
        }
    }
  });

  return RipManager.DashboardApp.Main.Controller;
});