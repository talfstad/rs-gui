define(["app"], function(RipManager){
  RipManager.module("GetRegistered", function(GetRegistered, RipManager, Backbone, Marionette, $, _){
    
    GetRegistered.Registered = Backbone.Model.extend({
      urlRoot: "/",

      events: {

      },

      defaults: {
        // "id": 0,
        // "external_id": 0,
        // "name": "",
        // "offer_link": "",
        // "website": "",
        // "login": "",
        // "user": ""
      },

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
        }
      }

    });

    GetOffers.OfferCollection = Backbone.Collection.extend({
      url: "/get_offers",
      model: GetOffers.Offer
    });

    var API = {
      getRegistered: function(){
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

    RipManager.reqres.setHandler("registered:getregistered", function(){
      return API.getRegistered();
    });
   
  });
  return RipManager.GetOffers;
});
