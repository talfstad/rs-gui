define(["app", "apps/main/earnings/list/list_view", 'moment'], function(RipManager, EarningsListView, moment){
  RipManager.module("EarningsApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      
      listEarnings: function(criterion){
        var me =
        require(["apps/main/earnings/list/list_model",
                 "common/loading_view"], function(GetEarningsModel, LoadingView){

          var earningsListLayout = new EarningsListView.EarningsListLayout();
          earningsListLayout.render();

          RipManager.mainLayout.mainRegion.show(earningsListLayout);

          // earningsListLayout.earningsGraphRegion.show(new LoadingView.Loading());
          earningsListLayout.earningsTableRegion.show(new LoadingView.Loading());


          var numbersWithCommas = function(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          };

          var fetchingEarnings = RipManager.request("earnings:getearnings");
          $.when(fetchingEarnings).done(function(earningsCollection){
            var totalClicks = 0,
                missedLeadsTotal = 0,
                conversionsTotal = 0,
                payoutTotal = 0;

            var graphData = new Array(),
                currentDay = earningsCollection.models[0].attributes.day,
                payoutForDay = 0,
                conversionsForDay = 0;

            $.each(earningsCollection.models, function(idx, model){
              totalClicks += model.attributes.clicks;
              missedLeadsTotal += model.attributes.missed_leads;
              conversionsTotal += model.attributes.conversions;
              payoutTotal += model.attributes.payout;

              if(moment(currentDay).format('LL') === moment(model.attributes.day).format('LL')) {
                //keep totaling for day
                payoutForDay += model.attributes.payout;
                conversionsForDay += model.attributes.conversions;
              } else {
                //add it to day
                graphData.push({
                  day: currentDay,
                  payout: payoutForDay,
                  conversions: conversionsForDay
                });

                //reset for next day
                currentDay = model.attributes.day;
                payoutForDay = model.attributes.payout;
                conversionsForDay = model.attributes.conversions;
              }
            });


            //graph view
            var earningsGraphView = new EarningsListView.EarningsGraph({
              earningsGraph: graphData
            });

            earningsListLayout.earningsGraphRegion.show(earningsGraphView);
           


            //create views
            var totalClicksView = new EarningsListView.OverviewDailyStatItem({
              value: numbersWithCommas(totalClicks),
              color: 'bg-yellow',
              icon: "fa fa-location-arrow",
              title: "Total Clicks"
            });

            var totalMissedLeads = new EarningsListView.OverviewDailyStatItem({
              value: numbersWithCommas(missedLeadsTotal),
              color: "bg-red",
              icon: "fa fa-fire-extinguisher",
              title: "Total Missed Leads"
            });

            var totalConversions = new EarningsListView.OverviewDailyStatItem({
              value: numbersWithCommas(conversionsTotal),
              color: "bg-blue",
              icon: "ion ion-social-usd",
              title: "Total Conversions"
            });

            var totalPayout = new EarningsListView.OverviewDailyStatItem({
              value: '$'+numbersWithCommas(payoutTotal),
              color: "bg-green",
              icon: "fa fa-diamond",
              title: "Total Payout"
            });


            try {
              earningsListLayout.overviewStat1Region.show(totalClicksView);
              earningsListLayout.overviewStat2Region.show(totalMissedLeads);
              earningsListLayout.overviewStat3Region.show(totalConversions);
              earningsListLayout.overviewStat4Region.show(totalPayout);
            } catch(e){}

            
            var earningsListView = new EarningsListView.EarningsListView({
              collection: earningsCollection
            });

            try {
              earningsListLayout.earningsTableRegion.show(earningsListView);
            } catch(e){}
            
          });
        });
      }
    }
  });

  return RipManager.EarningsApp.List.Controller;
});