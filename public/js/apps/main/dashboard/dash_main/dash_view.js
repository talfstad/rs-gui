define(["app", "tpl!apps/main/dashboard/dash_main/templates/dash.tpl", "adminLTEapp"],
function(RipManager, dashTpl){

  RipManager.module("DashboardApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    View.Dash = Marionette.ItemView.extend({
      className: "right-side",
      template: dashTpl,
      
      modelEvents: {
        // 'change': 'render'
      },

      events: {
        // "click #logout-link": "logout"
      },

      onDomRefresh: function() {
      
      },

      serializeData: function(){
        return {
          overViewStatsModel: this.options.overViewStatsModel
          // : this.options.model2.toJSON()
        };
      }


    });
  });

  return RipManager.DashboardApp.List.View;
});
