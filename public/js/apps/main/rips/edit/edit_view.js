define(["app", "apps/main/rips/common/views"], function(RipManager, CommonViews){
  RipManager.module("RipsApp.Edit.View", function(View, RipManager, Backbone, Marionette, $, _){
    View.Rip = CommonViews.EditDialogForm.extend({

    });
  });

  return RipManager.RipsApp.Edit.View;
});