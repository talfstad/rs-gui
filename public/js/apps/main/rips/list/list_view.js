define(["app",
        "tpl!apps/main/rips/list/templates/rips.tpl",
        "datatables"],

       function(RipManager, ripsTpl){
  RipManager.module("RipsApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){
    

    View.Rips = Marionette.ItemView.extend({
      className: "right-side",
      template: ripsTpl,

      triggers: {
        // "click td a.js-edit": "rip:edit"
      },

      events: {
       //  "click": "highlightName"
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
          "aoColumnDefs": [
              { "sWidth": "20px", "aTargets": [ 0,1] },
              { "sWidth": "120px", "aTargets": [4]}
          ],
          "order": [[ 0, "desc" ]]
          // iDisplayLength: 25
        });
      },

      serializeData: function(){
        return {
          rips: this.options.ripsCollection
        };
      }

      
    });

    
  });

  return RipManager.RipsApp.List.View;
});
