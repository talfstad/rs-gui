define(["app", "/js/apps/main/rips/report/report_view.js"], function(RipManager, RipReportView){

  RipManager.module("RipsApp.ListReport", function(RipReport, RipManager, Backbone, Marionette, $, _){
    RipReport.Controller = {
      listReport: function(criterion){
        require(["common/loading_view"], 
        function(LoadingView){

          var ripReportLayout = new RipReportView.RipReportlayout();
          ripReportLayout.render();

          RipManager.mainLayout.mainRegion.show(ripReportLayout);


          ripReportLayout.ripsStatsGraphRegion.show(new LoadingView.Loading());
          
          // var fetchingNewRips = RipManager.request("rips:getnewrips");
        });
      }
    }

  });
  return RipManager.RipsApp.ListReport.Controller;
});