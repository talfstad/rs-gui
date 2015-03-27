define(["app"], function(RipManager){
  RipManager.module("OverviewGraph", function(OverviewGraph, RipManager, Backbone, Marionette, $, _){
    

    //General model to use
    OverviewGraph.model = Backbone.Model.extend({
      defaults: {}
    });



    OverviewGraph.rippedHitsCollection = Backbone.Collection.extend({
      url: "/ripped_hits_for_n_days?n=30",
      model: OverviewGraph.model
    });

    OverviewGraph.jacksCollection = Backbone.Collection.extend({
      url: "/jacks_for_n_days?n=30",
      model: OverviewGraph.model
    });

    var API = {
      getTotalRippedHitsGraph: function(args){
        var totalRippedHitsGraphData = new OverviewGraph.rippedHitsCollection();
        var defer = $.Deferred();
        totalRippedHitsGraphData.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        return promise;
      },

      getTotalJacksGraph: function(args){
        var totalJacksGraph = new OverviewGraph.jacksCollection();
        var defer = $.Deferred();
        totalJacksGraph.fetch({
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

    RipManager.reqres.setHandler("dashboard:totalJacksGraph", function(args){
      return API.getTotalJacksGraph(args);
    });


  });
});