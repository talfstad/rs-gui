define(["app", "tpl!apps/main/dashboard/dash_main/templates/dash.tpl", 
  "tpl!apps/main/dashboard/dash_main/templates/overview_dash_item.tpl", 
  "tpl!apps/main/dashboard/dash_main/templates/overview_stats_graph.tpl", "morris"],
function(RipManager, dashTpl, overviewDashItem, overviewStatsGraphTpl){

  RipManager.module("DashboardApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    //made this little fucker so that i can hopefully make sub views that use regions
    View.DashListLayout = Marionette.LayoutView.extend({
      className: "right-side",
      template: dashTpl,
     
      regions: {
        overviewStat1Region: "#overview-stat-1",
        overviewStat2Region: "#overview-stat-2",
        overviewStat3Region: "#overview-stat-3",
        overviewStat4Region: "#overview-stat-4",
        overviewStatsGraph: "#overview-stats-graph",
        overviewTotals: "#overview-totals"
      }
    });


    View.OverviewDailyStatItem = Marionette.ItemView.extend({

      initialize: function (attrs) {
        this.options = attrs;
      },

      // className: "right-side",
      template: overviewDashItem,
      
      onDomRefresh: function(){
        
      },

      serializeData: function(){
        return this.options;
      }

    });


    View.overviewStatsGraph = Marionette.ItemView.extend({
      template: overviewStatsGraphTpl,

      totalRippedHitsAreaGraph: null,

      onDomRefresh: function() {
        //check if its null before making a call out
        if(!this.totalRippedHitsAreaGraph) {
          var data = [];
          var modelGraphData = this.options.totalRippedHitsGraph;
          var modelGraphJacksData = this.options.totalJacksGraph;

          for(var i=0 ; i<modelGraphData.length ; i++) {
            data.push({
              time: modelGraphData[i].attributes.day,
              jacks: modelGraphJacksData[i].attributes.hits,
              rippedHits: modelGraphData[i].attributes.hits
              
            });
          }

          data.reverse();

          //access the model to get the data
          this.totalRippedHitsAreaGraph = new Morris.Area({
            element: 'ripped-hits-chart',
            resize: true,
            data: data,
            hoverCallback: function(index, options, content) {
              var item = options.data[index];
              
              var percentJacked = (item.jacks / item.rippedHits) * 100;

              var html = "<div class='morris-hover-row-label'>2015-03-27</div><div class='morris-hover-point' style='color: #3c8dbc'>" +
                          "Jacks: " +
                          item.jacks +
                          "</div>" + 
                          "<div class='morris-hover-point' style='color: #a0d0e0'>" +
                          "Ripped Hits: " +
                          item.rippedHits +
                          "</div>" +
                          "<div class='morris-hover-point' style='color: #fff'>" +
                          percentJacked.toFixed(2) + "% Total Jacked" +
                          "</div>";

              return(html);
            },
            xkey: 'time',
            ykeys: ['jacks', 'rippedHits'],
            labels: ['Jacks: ', 'Ripped Hits: '],
            lineColors: ['#3c8dbc', '#a0d0e0'],
            hideHover: 'auto'
          });
        }
      },

      serializeData: function(){
        return {
          totalRippedHitsGraph: this.options.totalRippedHitsGraph,
          modelGraphJacksData: this.options.totalJacksGraph
        };
      }
    });



  });

  return RipManager.DashboardApp.List.View;
});
