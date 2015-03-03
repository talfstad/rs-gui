define(["app"], function(RipManager){
  RipManager.module("OverviewGraph", function(OverviewGraph, RipManager, Backbone, Marionette, $, _){
    


    OverviewGraph.model = Backbone.Model.extend({
      defaults: {

      }
    });

    OverviewGraph.collection = Backbone.Collection.extend({
      url: "/ripped_hits_for_n_days?n=20",
      model: OverviewGraph.model
    });

    var API = {
      getTotalRippedHitsGraph: function(args){
        var totalRippedHitsGraphData = new OverviewGraph.collection();
        var defer = $.Deferred();
        totalRippedHitsGraphData.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        return promise;
      }
    }


    RipManager.reqres.setHandler("dashboard:totalRippedHitsGraph", function(args){
      return API.getTotalRippedHitsGraph(args);
    });


  });
});