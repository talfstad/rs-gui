define(["app"], function(RipManager){
  RipManager.module("GetEarnings", function(GetEarnings, RipManager, Backbone, Marionette, $, _){
    
    GetEarnings.Earnings = Backbone.Model.extend({
      defaults: {
        offer_id: 0,
        external_id: 0,
        missed_leads: 0,
        missed_leads_payout: 0,
        offer_name: "",
        clicks: 0,
        conversions: 0,
        day: null,
        payout: 0
      }
    });

    GetEarnings.EarningsCollection = Backbone.Collection.extend({
      initialize: function(models, options) {
        this.url = '/reporting_for_n_days?n=' + options.n;
      },
      model: GetEarnings.Earnings,
    });

    //General model to use
    GetEarnings.Model = Backbone.Model.extend({
      defaults: {}
    });

    var API = {
      getEarningsGraph: function(args){
        var earningsGraphData = new GetEarnings.EarningsCollection();
        var defer = $.Deferred();
        earningsGraphData.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        return promise;
      },
      getEarnings: function(nDays){
        var earnings = new GetEarnings.EarningsCollection([], nDays);
        var defer = $.Deferred();
        earnings.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        return promise;
      }

    };

    RipManager.reqres.setHandler("earnings:graph", function(args){
      return API.getEarningsGraph(args);
    });


    RipManager.reqres.setHandler("earnings:getearnings", function(nDays){
      return API.getEarnings(nDays);
    });
   
  });
  return RipManager.GetEarnings;
});
