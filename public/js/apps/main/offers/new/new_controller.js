define(["app", "apps/main/offers/new/new_view",
        "apps/main/offers/list/list_controller",
        "bootstrap-dialog"
        ], function(RipManager, NewOfferView, ListController){
  RipManager.module("OffersApp.New", function(New, RipManager, Backbone, Marionette, $, _){
    New.Controller = {
      addOffer: function(){
        require(["apps/main/offers/list/list_model"], function(OfferModel){
          var newOffer = new OfferModel.Offer();

          var view = new NewOfferView.NewDialogForm({
            model: newOffer
          });

          var addOfferSuccess = function(model, message, other) {
            RipManager.trigger("offer:new:add", model);
            view.trigger("offer:new:notify", message.success, "success", model);
          };

          var addOfferError = function(model, message, other) {
            view.trigger("offer:new:notify", message.error, "danger");
            model.set(model.previousAttributes());
          };


          view.on("offer:new:submit", function(data){
            //client side validation
            if(this.model.isValid(true)) {
              this.model.save(data, {success: addOfferSuccess, error: addOfferError});
              view.closeDialog();
            } else {
              //TODO This doesn't contain the actual previous attr right now
              //because of the validation (i think)
              view.model.set(view.model.previousAttributes());
            }
            
          });

          //show dialog with view TODO
          view.showDialog();
        });
      },
    };
  });

  return RipManager.OffersApp.New.Controller;
});
