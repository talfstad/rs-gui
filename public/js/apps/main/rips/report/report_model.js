define(["app"], function(RipManager){
  RipManager.module("RipReportModel", function(RipReportModel, RipManager, Backbone, Marionette, $, _){
    
    //General model to use
    RipReportModel.model = Backbone.Model.extend({
      defaults: {}
    });

    RipReportModel.overviewCollection = Backbone.Collection.extend({
      initialize: function(models, options) {
        this.url = "/url_report_for_n_days?n=30&id=" + options.id;
      },

      model: RipReportModel.model
    });

    var API = {
      getOverviewstatsGraph: function(id){
        var totalRippedHitsGraphData = new RipReportModel.overviewCollection([], {id: id});
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

    RipManager.reqres.setHandler("report:overviewGraphData", function(id){
      return API.getOverviewstatsGraph(id);
    });

  });
});