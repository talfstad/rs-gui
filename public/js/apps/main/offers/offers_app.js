define(["app"], function(RipManager){
  RipManager.module("OffersApp", function(OffersApp, RipManager, Backbone, Marionette, $, _){
    OffersApp.startWithParent = false;

  });

  var executeAction = function(action, arg){
    RipManager.startSubApp("OffersApp");
    action(arg);
    RipManager.execute("set:active:header", "offers");
  };

  var checkAuth = function(callback, args) {
    require(["authentication/authentication_app"], function() {
      RipManager.execute("authentication:check", callback, args);
    });
  };

  var API = {
    listOffers: function(args){
      require(["apps/main/offers/list/list_controller",
               "apps/main/leftnav/leftnav_app"], function(ListController){
        executeAction(ListController.listOffers, args);
        RipManager.execute("set:active:leftnav", "offers");
        RipManager.navigate("offers");
      });
    },
    // editOfferSubmit: function(args){
    //   require(["apps/main/offers/edit/edit_controller"], function(EditController){
    //     executeAction(EditController.submitEdit, args);
    //   });
    // },
    addOffer: function(args){
      require(["apps/main/offers/new/new_controller"], function(NewController){
        executeAction(NewController.addOffer, args);
      });
    }
  };

  RipManager.on("offers:list", function(){
    checkAuth(API.listOffers);
  });

  RipManager.on("offers:new", function(){
    checkAuth(API.addOffer);
  });
 
  var authEnabledAPI = {
    listOffers: function(criterion){
      checkAuth(API.listOffers);
    }
  };
});

