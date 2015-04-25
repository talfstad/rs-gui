define(["app",
        "tpl!apps/main/registered/list/templates/registered.tpl",
        "tpl!apps/main/registered/list/templates/registered-list.tpl",
        "tpl!apps/main/registered/list/templates/no-registered.tpl",
        "tpl!apps/main/registered/list/templates/registered-item.tpl",
        "tpl!apps/main/registered/list/templates/registered-hits-graph.tpl",
        "tpl!apps/main/registered/list/templates/unregister.tpl",
        "moment",
        "bootstrap-dialog",
        "morris", "bootstrap-notify",
        "datatablesbootstrap"],

function(RipManager, registeredTpl, registeredListTpl, noRegisteredTpl, registeredItemTpl, registeredHitsGraphTpl, unregisterDialogTpl, moment, BootstrapDialog){
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

    View.UnregisterDialogView = Marionette.ItemView.extend({
      template: unregisterDialogTpl,

      triggers: {
        "click button.js-close" : "close"
      },

      showDialog: function(e){
        var me = this;
        this.render();

        BootstrapDialog.show({
          type: BootstrapDialog.TYPE_PRIMARY,
          title: '<h5><strong>Unregister Domain:</strong> ' + this.model.attributes.domain + '</h5>',
          message: this.$el,
          cssClass: 'login-dialog',
          onhide: function(dialogRef){
            me.trigger("close");
          },
          buttons: [{
            label: 'Close',
            action: function(dialogRef) {
                dialogRef.close();
            }
          },
          {
            label: 'Unregister',
            cssClass: 'btn-primary',
            hotkey: 13, //Enter key
            action: function(dialogRef) {
                me.submitUnregister();
            }
          }],
          draggable: true
        });
      },

      submitUnregister: function() {
        this.trigger("unregister:submit");
      },

      closeDialog: function(e){
        BootstrapDialog.closeAll();
      },   
    });


    View.RegisteredView = Marionette.ItemView.extend({
      template: registeredItemTpl,
      tagName: "tr",

      triggers:{
        "click td button.unregister": "unregister",
      },

      initialize: function(){
        this.listenTo(this, "unregister", this.highlightRow); 
        this.listenTo(this, "remove:highlightrow", this.removeHighlightRow);
      },

      highlightRow: function(e){
        //highlight the current row
        this.$el.addClass("registered-row-edit-highlight");
      },

      removeHighlightRow: function(e){
        //when dialog closed remove highlight
        this.$el.removeClass("registered-row-edit-highlight");
      }
           
    });

    //basically useless view for the composite view
    var noRegisteredView = Marionette.ItemView.extend({
      template: noRegisteredTpl,
      tagName: "tr",
      className: "alert",
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

      collectionEvents: {
        'remove': 'removeRowFromDatatables'
      },

      removeRowFromDatatables: function(model, two, options){
        $("#registered-table").dataTable().fnDeleteRow(options.index);
      },

      initialize: function(){
        this.listenTo(this, "unregister:notify", this.notify); 
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
      },

      notify: function(data, type) {

      var notifyOptions = {
        icon: 'glyphicon glyphicon-refresh glyphicon-refresh-animate',
        title: "Unregistering Domain: ",
        message: "",
        // url: 'https://github.com/mouse0270/bootstrap-notify',
        //target: '_blank'
      };

      var otherOptions = {
        // settings
        element: 'body',
        position: null,
        type: type,
        allow_dismiss: true,
        newest_on_top: false,
        placement: {
          from: "top",
          align: "right"
        },
        offset: 20,
        spacing: 10,
        z_index: 1031,
        delay: 1,
        timer: 800,
        url_target: '_blank',
        mouse_over: null,
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        },
        onShow: null,
        onShown: null,
        onClose: null,
        onClosed: null,
        icon_type: 'class',
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
          '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
          '<span data-notify="icon"></span> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          // '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>' 
      };

      if(type=="danger"){
        notifyOptions.title = "<strong>Failed to Unregister Domain</strong> <br />Please Stand by, one of our teamates armed with a neck beard will investigate this shortly.";
        notifyOptions.icon = "glyphicon glyphicon-warning-sign";
        otherOptions.delay = 0;
      }

      var notify = $.notify(notifyOptions,otherOptions);


      setTimeout(function() {
        notify.update('message', data);
      }, 850);


    }
    });
  });

  return RipManager.RegisteredApp.List.View;
});
