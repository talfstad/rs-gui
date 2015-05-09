define(["app", "apps/main/earnings/list/list_view", 'moment',"apps/main/earnings/list/list_model",
                 "common/loading_view"], function(RipManager, EarningsListView, moment,GetEarningsModel, LoadingView){
  RipManager.module("EarningsApp.List", function(List, RipManager, Backbone, Marionette, $, _){

    List.Controller = {
      
      listEarnings: function(nDays){
        var me = this;
        
          var earningsListLayout = new EarningsListView.EarningsListLayout({nDays: nDays});
          earningsListLayout.render();

          RipManager.mainLayout.mainRegion.show(earningsListLayout);

          earningsListLayout.earningsGraphRegion.show(new LoadingView.Loading());
          earningsListLayout.earningsTableRegion.show(new LoadingView.Loading());


          var numbersWithCommas = function(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          };

          var fetchingEarnings = RipManager.request("earnings:getearnings", nDays);
          $.when(fetchingEarnings).done(function(earningsCollection){
            var totalClicks = 0,
                missedLeadsTotal = 0,
                conversionsTotal = 0,
                payoutTotal = 0;

            var graphData = new Array(),
                currentDay = earningsCollection.models[0].attributes.day,
                clicksForDay = 0,
                conversionsForDay = 0;
                payoutForDay = 0;
            var collectionLength = earningsCollection.models.length;
            $.each(earningsCollection.models, function(idx, model){
              totalClicks += model.attributes.clicks;
              missedLeadsTotal += model.attributes.missed_leads;
              conversionsTotal += model.attributes.conversions;
              payoutTotal += model.attributes.payout;

              if(moment(currentDay).format('LL') === moment(model.attributes.day).format('LL')) {
                //keep totaling for day
                clicksForDay += model.attributes.clicks;
                conversionsForDay += model.attributes.conversions;
                payoutForDay += model.attributes.payout;
              } else {
                //add it to day
                graphData.push({
                  day: currentDay,
                  clicks: clicksForDay,
                  conversions: conversionsForDay,
                  payout: payoutForDay
                });

                //reset for next day
                currentDay = model.attributes.day;
                clicksForDay = model.attributes.clicks;
                conversionsForDay = model.attributes.conversions;
                payoutForDay = model.attributes.payout;
              }
              
              if(collectionLength -1 === idx) {
                graphData.push({
                  day: currentDay,
                  clicks: clicksForDay,
                  conversions: conversionsForDay,
                  payout: payoutForDay
                });
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
              icon: "fa fa-diamond",
              title: "Total Conversions"
            });

            var totalPayout = new EarningsListView.OverviewDailyStatItem({
              value: '$'+numbersWithCommas(payoutTotal),
              color: "bg-green",
              icon: "ion ion-social-usd",
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
       
      }
    }
  });

  return RipManager.EarningsApp.List.Controller;
});