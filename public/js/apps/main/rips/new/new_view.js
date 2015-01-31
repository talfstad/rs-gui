define(["app", "apps/main/rips/common/views"], function(RipManager, CommonViews){
  RipManager.module("RipsApp.New.View", function(View, RipManager, Backbone, Marionette, $, _){
    View.Rip = CommonViews.Form.extend({
      title: "New Rip",

      onRender: function(){
        this.$(".js-submit").text("Create rip");
      }
    });
  });

  return RipManager.RipsApp.New.View;
});
