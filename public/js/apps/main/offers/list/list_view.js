define(["app",
        "tpl!apps/main/offers/list/templates/offers.tpl",
        "tpl!apps/main/offers/list/templates/offers-list.tpl",
        "tpl!apps/main/offers/list/templates/no-offers.tpl",
        "tpl!apps/main/offers/list/templates/offers-item.tpl",
        "datatablesbootstrap",
        "bootstrap-notify"],

function(RipManager, offersTpl, offersListTpl, noOffersTpl, offerItemTpl){
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
        this.listenTo(this.model, 'change', this.updateDataTable, this);
        this.listenTo(this, "offer:edit", this.highlightRow); 
        this.listenTo(this, "remove:highlightrow", this.removeHighlightRow); 
      },

      template: offerItemTpl,
      tagName: "tr",

      triggers: {
        "click td button.btn": "offer:edit"
      },

      events: {
        "offer:edit": "highlightRow"
      },

      updateDataTable: function(e) {
        //update the grid with latest data
        $("#offers-table").dataTable().fnUpdate(this.model.attributes.redirect_rate + "%", this._index, 1); //redirect rate
        $("#offers-table").dataTable().fnUpdate("<a href='"+ this.model.attributes.replacement_links + "'>" + this.model.attributes.replacement_links + "</a>", this._index, 3); //replacement link

      },

      highlightRow: function(e){
        //highlight the current row
        this.$el.addClass("offers-row-edit-highlight");
      },

      removeHighlightRow: function(e){
        //when dialog closed remove highlight
        this.$el.removeClass("offers-row-edit-highlight");
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
      this.listenTo(this.collection, "reset", function(){
        this.attachHtml = function(collectionView, childView, index){
          collectionView.$el.append(childView.el);
        }
      });
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

    onDomRefresh: function() {
        $("#offers-table").dataTable({
          "deferRender": true,
          "aoColumnDefs": [
              { "bSortable": false, "aTargets": [4] }
          ],
        });

        $("#offers-table").addClass("table table-bordered table-hover");
        $("#offers-table").dataTable().fnSort([[0, 'desc']])
      }
    });
  });

  return RipManager.OffersApp.List.View;
});
