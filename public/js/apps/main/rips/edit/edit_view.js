define(["app", "apps/main/rips/common/views"], function(RipManager, CommonViews){
  RipManager.module("RipsApp.Edit.View", function(View, RipManager, Backbone, Marionette, $, _){
    View.Rip = CommonViews.Form.extend({
      initialize: function(){
        this.title = "Edit " + this.model.get("firstName") + " " + this.model.get("lastName");
      },

      onRender: function(){
        if(this.options.generateTitle){
          var $title = $("<h1>", { text: this.title });
          this.$el.prepend($title);
        }

        this.$(".js-submit").text("Update rip");
      }
    });
  });

  return RipManager.RipsApp.Edit.View;
});