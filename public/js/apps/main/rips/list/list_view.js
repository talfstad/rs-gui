define(["app",
        "apps/main/rips/common/dialog-region",
        "tpl!apps/main/rips/list/templates/rips.tpl",
        "tpl!apps/main/rips/list/templates/rips-list.tpl",
        "tpl!apps/main/rips/list/templates/no-rips.tpl",
        "tpl!apps/main/rips/list/templates/rips-item.tpl",
        "datatables",
        "bootstrap-notify"],

function(RipManager, dialogRegion, ripsTpl, ripsListTpl, noRipsTpl, ripItemTpl){
  RipManager.module("RipsApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    //made this little fucker so that i can hopefully make sub views that use regions
    View.RipsListLayout = Marionette.LayoutView.extend({
      className: "right-side",
      template: ripsTpl,
     
      regions: {
        ripsTableRegion: "#rips-table-container",
        dialogRegion: new dialogRegion.Dialog({
          el: "#dialog-region"
        })
      }
    });


    //View.Rip is a row view that belongs to a composite view! This allows us to pass the model
    //and stuff when we do events and stuff (i think)
    View.Rip = Marionette.ItemView.extend({
      initialize: function() {
        this.listenTo(this.model, 'change', this.updateDataTable, this);
        this.listenTo(this, "rip:edit", this.highlightRow); 
        this.listenTo(this, "remove:highlightrow", this.removeHighlightRow); 
      },

      template: ripItemTpl,
      tagName: "tr",

      triggers: {
        "click td button.btn": "rip:edit"
      },

      events: {
        "rip:edit": "highlightRow"
      },

      updateDataTable: function(e) {
        //redraw the table to make sure it knows about hte new data
        var data = $("#rips-table").DataTable().row(this.$el).data();
        data[1] = this.model.attributes.redirect_rate;
        data[3] = this.model.attributes.replacement_links;

        $("#rips-table").DataTable().row(this.$el).data(data).draw();

        //resort to preserve sort css *ugh*
        // currentSort = $("#rips-table").dataTable().fnSettings().aaSorting[0];
        // $("#rips-table").dataTable().fnSort([currentSort[0],currentSort[1]]); //col idx, asc/desc
      },

      highlightRow: function(e){
        //highlight the current row
        this.$el.addClass("rips-row-edit-highlight");
      },

      removeHighlightRow: function(e){
        //when dialog closed remove highlight
        this.$el.removeClass("rips-row-edit-highlight");
      }

      
    });

    //basically useless view for the composite view
    var noRipsView = Marionette.ItemView.extend({
      template: noRipsTpl,
      tagName: "tr",
      className: "alert"
    });

    //the composite view, this should combine all the magic
    //and show us an amazing table...
    View.Rips = Marionette.CompositeView.extend({
    id: "rips-table",
    tagName: "table",
    className: "display dataTable",
    template: ripsListTpl,
    emptyView: noRipsView,
    childView: View.Rip,
    childViewContainer: "tbody",

    initialize: function(){
      this.listenTo(this, "rip:edit:notify", this.notify); 
      this.listenTo(this.collection, "reset", function(){
        this.attachHtml = function(collectionView, childView, index){
          collectionView.$el.append(childView.el);
        }
      });
    },

    notify: function(data, type) {

      var notifyOptions = {
        icon: 'glyphicon glyphicon-refresh glyphicon-refresh-animate',
        title: "Updating Ripped Url: ",
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
        notifyOptions.title = "<strong>Failed to Update Rip</strong> <br />Please Stand by, one of our surfer dude coder guys will investigate this shortly.";
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

        $("#rips-table").DataTable({
          "bSortClasses": true,
          "aoColumnDefs": [
              { "sWidth": "65px", "aTargets": [0] },
              { "sWidth": "90px", "aTargets": [1] },
              { "sWidth": "120px", "aTargets": [4] }
          ],
          "order": [[ 0, "desc" ]]
          // iDisplayLength: 25
        });
      }
    });
  });

  return RipManager.RipsApp.List.View;
});
