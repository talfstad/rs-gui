define(["app",
        "tpl!apps/main/registered/list/templates/registered.tpl",
        "tpl!apps/main/registered/list/templates/registered-list.tpl",
        "tpl!apps/main/registered/list/templates/no-registered.tpl",
        "tpl!apps/main/registered/list/templates/registered-item.tpl",
        "tpl!apps/main/registered/list/templates/registered-hits-graph.tpl",
        "moment",
        "morris",
        "datatablesbootstrap", 
        "bootstrap-dialog"],

function(RipManager, registeredTpl, registeredListTpl, noRegisteredTpl, registeredItemTpl, registeredHitsGraphTpl, moment){
  RipManager.module("RegisteredApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    //made this little fucker so that i can hopefully make sub views that use regions
    View.RegisteredListLayout = Marionette.LayoutView.extend({
      className: "right-side",
      template: registeredTpl,
     
      regions: {
        registeredGraphRegion: "#registered-hits-graph",
        registeredTableRegion: "#registered-table-container"
      }
    });

    View.RegisteredHitsGraph = Marionette.ItemView.extend({
      template: registeredHitsGraphTpl,
      
      onDomRefresh: function() {
        var data = [];
        var modelGraphData = this.options.registeredHitsGraph;

        for(var i=0 ; i<modelGraphData.length ; i++) {
          data.push({
            time: modelGraphData[i].attributes.day,
            hits: modelGraphData[i].attributes.hits
          });
        }

        //access the model to get the data
        var registeredHitsGraph = new Morris.Area({
          element: 'registered-hits-chart',
          resize: true,
          data: data,
          xkey: 'time',
          ykeys: ['hits'],
          labels: ['Hits'],
          lineColors: ['#3c8dbc'], //'#3c8dbc', 
          fillOpacity: 0.1,
          hideHover: 'auto',
        });
      },

      serializeData: function(){
        return {
          registeredHitsGraph: this.options.registeredHitsGraph
        }
      }
    });


    View.RegisteredView = Marionette.ItemView.extend({
      template: registeredItemTpl,
      tagName: "tr",

           
    });

    //basically useless view for the composite view
    var noRegisteredView = Marionette.ItemView.extend({
      template: noRegisteredTpl,
      tagName: "tr",
      className: "alert"
    });

    //the composite view, this should combine all the magic
    //and show us an amazing table...
    View.RegisteredListView = Marionette.CompositeView.extend({
      id: "registered-table",
      tagName: "table",
      className: "display dataTable",
      template: registeredListTpl,
      emptyView: noRegisteredView,
      childView: View.RegisteredView,
      childViewContainer: "tbody",


      initialize: function(){
        this.listenTo(this.collection, "reset", function(){
          this.attachHtml = function(collectionView, childView, index){
            collectionView.$el.append(childView.el);
          }
        });
      },

      onRenderCollection: function(){
        this.attachHtml = function(collectionView, childView, index){
          collectionView.$el.prepend(childView.el);
        }
      },

      onDomRefresh: function() {
        $("#registered-table").dataTable({
          "deferRender": true,
          "aoColumnDefs": [
            { 
              fnRender: function ( obj ) {
                var date = new Date(obj.aData[0]);

                return moment(date).format('LL');
              },
              "aTargets": [0] 
            },
           
            { "bSortable": false, "aTargets": [3] }
          ]
        });

        $("#registered-table").addClass("table table-bordered table-hover");
        $("#registered-table").dataTable().fnSort([[0, 'desc']])
      }
    });
  });

  return RipManager.RegisteredApp.List.View;
});
