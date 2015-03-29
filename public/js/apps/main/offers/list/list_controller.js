define(["app", "apps/main/offers/list/list_view"], function(RipManager, OffersListView){
  RipManager.module("OffersApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listOffers: function(criterion){
        require(["apps/main/offers/list/list_model",
                 "common/loading_view"], function(getOffersModel, LoadingView){

          var offersListLayout = new OffersListView.OffersListLayout();
          offersListLayout.render();

          RipManager.mainLayout.mainRegion.show(offersListLayout);

          var loadingView = new LoadingView.Loading();
          offersListLayout.offersTableRegion.show(loadingView);

          var fetchingOffers = RipManager.request("offers:getoffers");
          $.when(fetchingOffers).done(function(offers){
            
            var offersListView = new OffersListView.Offers({
              collection: offers
            });

            var saveOfferSuccess = function(model, message, other) {
              offersListView.trigger("offer:edit:notify", message.success, "success");
            };

            var saveOfferError = function(model, message, other) {
              offersListView.trigger("offer:edit:notify", message.error, "danger");
              model.set(model.previousAttributes());
            };

            //first check if main application has loaded, must load that first
            //it sets up some main things for the main app including left nav
            //the main layout, etc. TODO
            require(["apps/main/offers/list/edit_view"], function(EditOfferView){
              offersListView.on("childview:offer:edit", function(childView, args){

                var model = args.model;
                var view = new EditOfferView.Offer({
                  model: model
                });

                view.on("offer:edit:submit", function(data){
                  
                  if(this.model.isValid(true)) {
                    model.save(data, {success: saveOfferSuccess, error: saveOfferError});
                    view.closeDialog();
                  } else {
                    //TODO This doesn't contain the actual previous attr right now
                    //because of the validation (i think)
                    view.model.set(view.model.previousAttributes());
                  }
                  
                });


                view.on("close", function(){
                  args.view.trigger("remove:highlightrow");
                });

                view.showDialog();

              });
            });
            
            offersListView.on("childview:offer:delete", function(childView, model) {
              //show a are you sure? dialog, on OK call destroy()
              model.destroy();
            });

            try {
              offersListLayout.offersTableRegion.show(offersListView);
            } catch(e){}
            
          });
        });
      }
    }
  });

  return RipManager.OffersApp.List.Controller;
});