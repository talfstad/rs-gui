define(["app", "apps/main/offers/dialog/views"], function(RipManager, DialogViews){
  RipManager.module("OffersApp.Edit.View", function(View, RipManager, Backbone, Marionette, $, _){
    View.Offer = DialogViews.EditDialogForm.extend({

    });
  });

  return RipManager.OffersApp.Edit.View;
});