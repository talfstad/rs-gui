define(["app", "tpl!apps/main/dashboard/dash_main/templates/dash.tpl", "morris"],
function(RipManager, dashTpl){

  RipManager.module("DashboardApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    View.Dash = Marionette.ItemView.extend({
      className: "right-side",
      template: dashTpl,
      totalRippedHitsAreaGraph: null,
      
      modelEvents: {
        // 'change': 'render'
      },

      events: {
        // "click #logout-link": "logout"
      },

      onDomRefresh: function() {
        //check if its null before making a call out
        if(!this.totalRippedHitsAreaGraph) {
          var data = [];
          var modelGraphData = this.options.totalRippedHitsGraph;
          for(var i=0 ; i<modelGraphData.length ; i++) {
            data.push({y: modelGraphData[i].attributes.day, item1: modelGraphData[i].attributes.hits});
          }

          //access the model to get the data
          this.totalRippedHitsAreaGraph = new Morris.Area({
            element: 'ripped-hits-chart',
            resize: true,
            data: data,
            xkey: 'y',
            ykeys: ['item1'],
            labels: ['Ripped Hits: '],
            lineColors: ['#a0d0e0', '#3c8dbc'],
            hideHover: 'auto'
          });
        }
      },

      serializeData: function(){
        return {
          overViewStatsModel: this.options.overViewStatsModel,
          totalRippedHitsGraph: this.options.totalRippedHitsGraph
        };
      }


    });
  });

  return RipManager.DashboardApp.List.View;
});
