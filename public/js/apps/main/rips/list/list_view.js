define(["app",
        "apps/main/rips/common/dialog-region",
        "tpl!apps/main/rips/list/templates/rips.tpl",
        "tpl!apps/main/rips/list/templates/rips-list.tpl",
        "tpl!apps/main/rips/list/templates/no-rips.tpl",
        "tpl!apps/main/rips/list/templates/rips-item.tpl",
        "datatables"],

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
      template: ripItemTpl,
      tagName: "tr",

      triggers: {
        "click td button.btn": "rip:edit"
      },

      events: {
       
      },

      
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
        $("#rips-table").DataTable({
          // columns: [
          //   {width: "5%"},
          //   {width: "5%"},
          //   null,
          //   null,
          //   {width: "5%"}
          // ],
          // "aoColumnDefs": [
          //     { "sWidth": "20px", "aTargets": [ 0,1] },
          //     { "sWidth": "120px", "aTargets": [4]}
          // ],
          "order": [[ 0, "desc" ]]
          // iDisplayLength: 25
        });
      }
    });
  });

  return RipManager.RipsApp.List.View;
});
