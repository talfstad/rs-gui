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
          columns: [
            {width: "30%"},
            {width: "30%"},
            {width: "15%"},
            {width: "15%"},
            {width: "10%"},
          ]
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
