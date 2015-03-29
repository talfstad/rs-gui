define(["app"], function(RipManager){
  RipManager.module("GetOffers", function(GetOffers, RipManager, Backbone, Marionette, $, _){
    GetOffers.Offer = Backbone.Model.extend({
      urlRoot: "/update_offer",

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
      url: "/offers",
      model: GetOffers.Offer
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
      },

      mockOffers: function(){
        var mockData = [
          {
            "id": 1,
            "external_id": 82,
            "name": "Power Pro UK",
            "offer_link": "http://z6m.go2cloud.org/aff_c?offer_id=82&aff_id=1006&aff_sub=CJ25-54&aff_sub2={var2}&aff_sub3={clickid}",
            "website": "oasisads.com",
            "login": "jake.kalb@gmail.com",
            "user": "test@email.com"
          },
          {
            "id": 2,
            "external_id": 110,
            "name": "Power Pro AU",
            "offer_link": "http://z6m.go2cloud.org/aff_c?offer_id=110&aff_id=1006&aff_sub=CJ25-54&aff_sub2={var2}&aff_sub3={clickid}",
            "website": "oasisads.com",
            "login": "jake.kalb@gmail.com",
            "user": "test@email.com"
          },
          {
            "id": 3,
            "external_id": 2,
            "name": "Ripped Muscle X US",
            "offer_link": "http://z6m.go2cloud.org/aff_c?offer_id=2&aff_id=1006&aff_sub=CJ25-54&aff_sub2={var2}&aff_sub3={clickid}",
            "website": "",
            "login": "jake.kalb@gmail.com",
            "user": "test@email.com"
          }
        ]

        var mockOffers = new GetOffers.OfferCollection(mockData);

        return mockOffers;

      }

    };

    RipManager.reqres.setHandler("offers:getoffers", function(){
      return API.getOffers();
    });
   
  });

});
