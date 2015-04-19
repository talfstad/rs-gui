define(["app"], function(RipManager){
  RipManager.module("RipsStatsGraph", function(RipsStatsGraph, RipManager, Backbone, Marionette, $, _){
    
    //General model to use
    RipsStatsGraph.model = Backbone.Model.extend({
      defaults: {}
    });

    RipsStatsGraph.ripsCollection = Backbone.Collection.extend({
      url: "/rips_for_n_days?n=30",
      model: RipsStatsGraph.model
    });

    var API = {
      getTotalRipsGraph: function(args){
        var totalRippedHitsGraphData = new RipsStatsGraph.ripsCollection();
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

    RipManager.reqres.setHandler("rips:stats", function(args){
      return API.getTotalRipsGraph(args);
    });

  });
});