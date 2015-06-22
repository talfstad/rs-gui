define(["app"], function(RipManager){
  RipManager.module("GetOffers", function(GetOffers, RipManager, Backbone, Marionette, $, _){
    GetOfferList = Backbone.Model.extend({
      urlRoot: ""
    });

    GetOffers.Offer = Backbone.Model.extend({
      urlRoot: "/update_offer",

      validation: {
        name: {
          required: true
        },
        offer_link: {
            required: true
        },
        website: {
            required: true
        },
        login: {
            required: true
        },
        external_id: {
            required: true
        }
      }
    });

    GetOffers.OfferCollection = Backbone.Collection.extend({
      url: "/get_offers",
      model: GetOffers.Offer,

      onlyForUser: function(user){
        filtered = this.filter(function(registeredModel) {
          return registeredModel.get("user") === user;
        });
      
        return filtered;
      }
    });

    var API = {
      getOffers: function(){
        var offers = new GetOffers.OfferCollection();
        var defer = $.Deferred();
        offers.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        return promise;
      }

    };

    RipManager.reqres.setHandler("offers:getoffers", function(){
      return API.getOffers();
    });
   
  });
  return RipManager.GetOffers;
});
