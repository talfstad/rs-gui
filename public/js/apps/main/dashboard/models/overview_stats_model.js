define(["app"], function(RipManager){
  RipManager.module("OverviewStats", function(OverviewStats, RipManager, Backbone, Marionette, $, _){
    
    OverviewStats.collection = Backbone.Collection.extend({
      url: "/stats_overview",
      model: OverviewStats.model
    });

    OverviewStats.model = Backbone.Model.extend({
      defaults: {
        total_daily_ripped_hits: "0",
        total_daily_registered_hits: "0",
        total_daily_jacks: "0",
        total_ripped_hits: "0",
        total_daily_rips: "0",
        total_rips: "0",
        total_registered_hits: "0"
      }
    });

    var API = {
      getOverviewStats: function(args){
          var login = new OverviewStats.collection();
          var defer = $.Deferred();
          login.fetch({
            success: function(data){
              defer.resolve(data);
            }, 
            type: 'GET'
          });
          var promise = defer.promise();
          
          return promise;
        }
    }

    RipManager.reqres.setHandler("dashboard:overviewStats", function(args){
      return API.getOverviewStats(args);
    });


  });
});