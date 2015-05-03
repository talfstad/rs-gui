define(["app",
        "tpl!apps/main/landers/list/templates/landers.tpl",
        "tpl!apps/main/landers/list/templates/landers-list.tpl",
        "tpl!apps/main/landers/list/templates/no-landers.tpl",
        "tpl!apps/main/landers/list/templates/lander-item.tpl",
        "bootstrap-dialog",
        "moment",
        "datatablesbootstrap",
        "bootstrap-notify"],

function(RipManager, landersTpl, landersListTpl, noLandersTpl, landerItemTpl, BootstrapDialog, moment){
  RipManager.module("LandersApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    //made this little fucker so that i can hopefully make sub views that use regions
    View.LandersListLayout = Marionette.LayoutView.extend({
      className: "right-side",
      template: landersTpl,
     
      regions: {
        landersTableRegion: "#landers-table-container",
        dialogRegion: "#dialog-region"
      }
    });


    View.Lander = Marionette.ItemView.extend({
      initialize: function() {
        // this.listenTo(this.model, 'change', this.updateDataTable, this);
        this.listenTo(this, "lander:edit", this.highlightRow);

        this.listenTo(this, "lander:delete:confirm", this.deleteLanderConfirm);
        this.listenTo(this, "remove:highlightrow", this.removeHighlightRow);
      },

      template: landerItemTpl,
      tagName: "tr",

      triggers: {
        "click td button.lander-edit": "lander:edit"
      },

      modelEvents: {
        "change": "updateDataTable"
      },

      events: {
        "lander:edit": "highlightRow",
      },

      templateHelpers: {
         admin: RipManager.session.get("admin")
      },

     

      highlightRow: function(e){
        //highlight the current row
        this.$el.addClass("landers-row-edit-highlight");
      },

      removeHighlightRow: function(e){
        //when dialog closed remove highlight
        this.$el.removeClass("landers-row-edit-highlight");
      },

      updateDataTable: function(model, collection, options) {
        var dt = $("#landers-table").dataTable();
        // // update the grid with latest data
        // $("#landers-table").dataTable().fnUpdate(model.attributes.name, this._index, 0, false); //offer name
        // $("#landers-table").dataTable().fnUpdate("<a href='"+ model.attributes.offer_link + "'>" + model.attributes.offer_link + "</a>", this._index, 1, false); //offer link
        // $("#landers-table").dataTable().fnUpdate("<a href='"+ model.attributes.website + "'>" + model.attributes.website + "</a>", this._index, 2, false); //admin URL
        // $("#landers-table").dataTable().fnUpdate(this.model.attributes.login, this._index, 3, false); //admin login username
      }

      
    });

    //basically useless view for the composite view
    var noLandersView = Marionette.ItemView.extend({
      template: noLandersTpl,
      tagName: "tr",
      className: "alert"
    });

    //the composite view, this should combine all the magic
    //and show us an amazing table...
    View.Landers = Marionette.CompositeView.extend({
      id: "landers-table",
      tagName: "table",
      className: "display dataTable",
      template: landersListTpl,
      emptyView: noLandersView,
      childView: View.Lander,
      childViewContainer: "tbody",


      initialize: function(){
        this.listenTo(this, "lander:edit:notify", this.notify); 
        this.listenTo(this, "lander:new:add", this.addLanderToDataTable);
        this.listenTo(this, "lander:grid:resort", this.gridResort);
        this.listenTo(this.collection, "reset", function(){
          this.attachHtml = function(collectionView, childView, index){
            collectionView.$el.append(childView.el);
          }
        });
      },

       addLanderToDataTable: function() {
        //destroy
        $("#landers-table").dataTable().fnDestroy();
        
        this.onDomRefresh();
      },

      notify: function(data, type) {

        var notifyOptions = {
          icon: 'glyphicon glyphicon-refresh glyphicon-refresh-animate',
          title: "Updating Lander: ",
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
          notifyOptions.title = "<strong>Failed to Update Lander</strong> <br />Please Stand by, one of our super talented laborers will fix this.";
          notifyOptions.icon = "glyphicon glyphicon-warning-sign";
          otherOptions.delay = 0;
        } 

        var notify = $.notify(notifyOptions,otherOptions);


        setTimeout(function() {
          notify.update('message', data);
        }, 850);


      },

      onRenderCollection: function(){
        this.attachHtml = function(collectionView, childView, index){
          collectionView.$el.prepend(childView.el);
        }
      },

      gridResort: function(){
        $("#landers-table").dataTable().fnSort([[0, 'desc']])
      },

      onDomRefresh: function() {
        $("#landers-table").dataTable({
          "deferRender": true,
           "aoColumnDefs": [
           { 
              fnRender: function ( obj ) {
                var date = new Date(obj.aData[1]);
                return moment(date).format('LL');
              },
              "aTargets": [1] 
            },
          //   { "sWidth": "120px", "aTargets": [0] },
          //   { "sWidth": "400px", "aTargets": [1] },
          //   { "sWidth": "100px", "aTargets": [2] },
          //   { "sWidth": "150px", "aTargets": [3] },
            { "bSortable": false, "aTargets": [3] }
           ]
        });

        $("#landers-table").addClass("table table-bordered table-hover");
        $("#landers-table").dataTable().fnSort([[1, 'desc']])
      }
    });
  });

  return RipManager.LandersApp.List.View;
});
