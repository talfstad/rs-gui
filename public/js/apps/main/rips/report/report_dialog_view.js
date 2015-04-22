define(["app", "tpl!apps/main/rips/report/templates/report_dialog.tpl",
        "bootstrap-dialog", "morris"], function(RipManager, ReportDialogTemplate, BootstrapDialog){
  RipManager.module("RipsApp.ReportDialog.View", function(View, RipManager, Backbone, Marionette, $, _){

    View.ReportDialog = Marionette.ItemView.extend({
        overviewGraphDataGraph: null,
        template: ReportDialogTemplate,
        
        initialize: function() {
         
        },

        triggers: {
          "click button.js-close" : "close"
        },

        showDialog: function(e){
          var me = this;
          this.render();

          BootstrapDialog.show({
            type: BootstrapDialog.TYPE_PRIMARY,
            title: '<h5><strong>Rip Report:</strong> ' + this.model.attributes.url + '</h5>',
            message: this.$el,
            cssClass: 'login-dialog',
            onhide: function(dialogRef){
              me.trigger("close");
            },
            onshown: function(dialogRef){
              me.onShowDialogDom(dialogRef);
            },
            buttons: [{
              label: 'Close',
              action: function(dialogRef) {
                  dialogRef.close();
              }
            }],
            draggable: true
          });
        },

        onShowDialogDom: function(dialogRef){
          //check if its null before making a call out
          if(!this.overviewGraphDataGraph) {
            var data = [];
            var modelGraphData = this.options.overviewGraphData.models;

            for(var i=0 ; i<modelGraphData.length ; i++) {
              data.push({
                time: modelGraphData[i].attributes.day,
                jacks: modelGraphData[i].attributes.jacks,
                rippedHits: modelGraphData[i].attributes.hits
                
              });
            }

            //access the model to get the data
            this.overviewGraphDataGraph = new Morris.Area({
              element: 'rip-report-overview-chart',
              resize: true,
              data: data,
              xkey: 'time',
              ykeys: ['jacks', 'rippedHits'],
              labels: ['Jacks: ', 'Ripped Hits: '],
              lineColors: ['#3c8dbc', '#a0d0e0'],
              hideHover: 'auto'
            });
          }
        },

        closeDialog: function(e){
          BootstrapDialog.closeAll();
        },

        serializeData: function(){
          return {
            model: this.model.toJSON(),
            overviewGraphData: this.options.overviewGraphData.toJSON()
          };
        }

        

      });
  });

  return RipManager.RipsApp.ReportDialog.View;
});