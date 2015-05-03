define(["app", "apps/main/earnings/list/list_view"], function(RipManager, EarningsListView){
  RipManager.module("EarningsApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listEarnings: function(criterion){
        require(["apps/main/earnings/list/list_model",
                 "common/loading_view"], function(GetEarningsModel, LoadingView){

          var earningsListLayout = new EarningsListView.EarningsListLayout();
          earningsListLayout.render();

          RipManager.mainLayout.mainRegion.show(earningsListLayout);

          // earningsListLayout.earningsGraphRegion.show(new LoadingView.Loading());
          earningsListLayout.earningsTableRegion.show(new LoadingView.Loading());

          // var fetchingEarningsGraphData = RipManager.request("earnings:graph");
          // $.when(fetchingEarningsGraphData).done(function(graphData){
            
          //   var earningsGraphView = new EarningsListView.EarningsHitsGraph({
          //     earningsHitsGraph: graphData.models
          //   });

          //   earningsListLayout.earningsGraphRegion.show(earningsGraphView);
          // });

          var fetchingEarnings = RipManager.request("earnings:getearnings");
          $.when(fetchingEarnings).done(function(earningsCollection){
            
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