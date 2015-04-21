define(["app",
        "tpl!/js/apps/main/rips/report/templates/rip_report.tpl",
        "tpl!/js/apps/main/rips/report/templates/overview_stats_graph.tpl",
        "datatablesbootstrap", "morris",
        "bootstrap-notify"],

function(RipManager, ripReportTpl, overviewStatsGraphTpl){
  RipManager.module("RipsApp.RipReport.View", function(View, RipManager, Backbone, Marionette, $, _){

    //made this little fucker so that i can hopefully make sub views that use regions
    View.RipReportlayout = Marionette.LayoutView.extend({
      className: "right-side",
      template: ripReportTpl,
     
      regions: {
        ripsStatsGraphRegion: "#report-hits-jacks-graph",
      }
    });

    View.overviewStatsGraph = Marionette.ItemView.extend({
      template: overviewStatsGraphTpl,

      totalRippedHitsAreaGraph: null,

      onDomRefresh: function() {
        //check if its null before making a call out
        // if(!this.totalRippedHitsAreaGraph) {
        //   var data = [];
        //   var modelGraphData = this.options.totalRippedHitsGraph;
        //   var modelGraphJacksData = this.options.totalJacksGraph;

        //   for(var i=0 ; i<modelGraphData.length ; i++) {
        //     data.push({
        //       time: modelGraphData[i].attributes.day,
        //       jacks: modelGraphJacksData[i].attributes.hits,
        //       rippedHits: modelGraphData[i].attributes.hits
              
        //     });
        //   }

        //   //access the model to get the data
        //   this.totalRippedHitsAreaGraph = new Morris.Area({
        //     element: 'rip-report-overview-chart',
        //     resize: true,
        //     data: data,
        //     xkey: 'time',
        //     ykeys: ['jacks', 'rippedHits'],
        //     labels: ['Replacement Offers Shown: ', 'Ripped Hits: '],
        //     lineColors: ['#3c8dbc', '#a0d0e0'],
        //     hideHover: 'auto'
        //   });
        // }
      },

      serializeData: function(){
        // return {
        //   totalRippedHitsGraph: this.options.totalRippedHitsGraph,
        //   modelGraphJacksData: this.options.totalJacksGraph
        // };
      }
    });

    

  });
  return RipManager.RipsApp.RipReport.View;
});
