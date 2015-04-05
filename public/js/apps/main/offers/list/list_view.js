define(["app",
        "tpl!apps/main/offers/list/templates/offers.tpl",
        "tpl!apps/main/offers/list/templates/offers-list.tpl",
        "tpl!apps/main/offers/list/templates/no-offers.tpl",
        "tpl!apps/main/offers/list/templates/offers-item.tpl",
        "bootstrap-dialog",
        "datatablesbootstrap",
        "bootstrap-notify"],

function(RipManager, offersTpl, offersListTpl, noOffersTpl, offerItemTpl, BootstrapDialog){
  RipManager.module("OffersApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    //made this little fucker so that i can hopefully make sub views that use regions
    View.OffersListLayout = Marionette.LayoutView.extend({
      className: "right-side",
      template: offersTpl,
     
      regions: {
        offersTableRegion: "#offers-table-container",
        dialogRegion: "#dialog-region"
      }
    });


    View.Offer = Marionette.ItemView.extend({
      initialize: function() {
        // this.listenTo(this.model, 'change', this.updateDataTable, this);
        this.listenTo(this, "offer:edit", this.highlightRow);

        this.listenTo(this, "offer:delete:confirm", this.deleteOfferConfirm); 
        this.listenTo(this, "remove:highlightrow", this.removeHighlightRow); 
      },

      template: offerItemTpl,
      tagName: "tr",

      triggers: {
        "click td button.offer-edit": "offer:edit",
        "click td button.offer-delete": "offer:delete:confirm"
      },

      modelEvents: {
        "change": "updateDataTable"
      },

      events: {
        "offer:edit": "highlightRow",
        "offer:delete:confirm": "deleteOfferConfirm"
      },

      templateHelpers: {
         admin: RipManager.session.get("admin")
      },

     

      highlightRow: function(e){
        //highlight the current row
        this.$el.addClass("offers-row-edit-highlight");
      },

      onDeleteDialogClose: function(){
        this.$el.removeClass("offers-row-edit-highlight");
      },

      deleteOfferConfirm: function(e){
          this.highlightRow();

          var me = this;
          this.render();

          BootstrapDialog.show({
            type: BootstrapDialog.TYPE_PRIMARY,
            title: '<h5><strong>Offer Delete</strong></h5>',
            message: '<p>Are you sure you want to delete this offer?</p>',
            cssClass: 'login-dialog',
            onhide: function(dialogRef){
              me.onDeleteDialogClose();
            },
            buttons: [{
              label: 'Close',
              action: function(dialogRef) {
                  me.onDeleteDialogClose();
                  dialogRef.close();
              }
            },
            {
              label: 'Delete Offer',
              cssClass: 'btn-primary',
              hotkey: 13, //Enter key
              action: function(dialogRef) {
                  $("#offers-table").dataTable().fnDeleteRow(me._index); //delete from dt
                  me.trigger("offer:delete", me.model); //actually delete offer
                  me.onDeleteDialogClose();
                  dialogRef.close();

              }
            }],
            draggable: true
          });
      },

      removeHighlightRow: function(e){
        //when dialog closed remove highlight
        this.$el.removeClass("offers-row-edit-highlight");
      },

      updateDataTable: function(model, collection, options) {
        var dt = $("#offers-table").dataTable();
        // update the grid with latest data
        $("#offers-table").dataTable().fnUpdate(model.attributes.name, this._index, 0, false); //offer name
        $("#offers-table").dataTable().fnUpdate("<a href='"+ model.attributes.offer_link + "'>" + model.attributes.offer_link + "</a>", this._index, 1, false); //offer link
        $("#offers-table").dataTable().fnUpdate("<a href='"+ model.attributes.website + "'>" + model.attributes.website + "</a>", this._index, 2, false); //admin URL
        $("#offers-table").dataTable().fnUpdate(this.model.attributes.login, this._index, 3, false); //admin login username
      }

      
    });

    //basically useless view for the composite view
    var noOffersView = Marionette.ItemView.extend({
      template: noOffersTpl,
      tagName: "tr",
      className: "alert"
    });

    //the composite view, this should combine all the magic
    //and show us an amazing table...
    View.Offers = Marionette.CompositeView.extend({
      id: "offers-table",
      tagName: "table",
      className: "display dataTable",
      template: offersListTpl,
      emptyView: noOffersView,
      childView: View.Offer,
      childViewContainer: "tbody",


      initialize: function(){
        this.listenTo(this, "offer:edit:notify", this.notify); 
                this.listenTo(this, "offer:new:add", this.addOfferToDataTable);
        this.listenTo(this, "offer:grid:resort", this.gridResort);
        this.listenTo(this.collection, "reset", function(){
          this.attachHtml = function(collectionView, childView, index){
            collectionView.$el.append(childView.el);
          }
        });
      },

       addOfferToDataTable: function() {
        //destroy
        $("#offers-table").dataTable().fnDestroy();
        
        this.onDomRefresh();
      },

      notify: function(data, type) {

        var notifyOptions = {
          icon: 'glyphicon glyphicon-refresh glyphicon-refresh-animate',
          title: "Updating Offer: ",
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
          notifyOptions.title = "<strong>Failed to Update Offer</strong> <br />Please Stand by, one of our surfer dude coder guys will investigate this shortly.";
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
        $("#offers-table").dataTable().fnSort([[0, 'desc']])
      },

      onDomRefresh: function() {
        $("#offers-table").dataTable({
          "deferRender": true,
          "aoColumnDefs": [
              { "sWidth": "20%", "aTargets": [0] },
              { "sWidth": "40%", "aTargets": [1] },
              { "sWidth": "20%", "aTargets": [2] },
              { "sWidth": "10%", "aTargets": [3] },
              { "sWidth": "10%", "bSortable": false, "aTargets": [4] }
          ]
        });

        $("#offers-table").addClass("table table-bordered table-hover");
        $("#offers-table").dataTable().fnSort([[0, 'desc']])
      }
    });
  });

  return RipManager.OffersApp.List.View;
});
