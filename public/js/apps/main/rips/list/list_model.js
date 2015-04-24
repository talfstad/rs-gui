define(["app"], function(RipManager){
  RipManager.module("GetRips", function(GetRips, RipManager, Backbone, Marionette, $, _){
    GetRips.Rip = Backbone.Model.extend({
      urlRoot: "/update_ripped_url_by_offer_id",

      defaults: {
        "id": "",
        "links_list": "",
        "user": "",
        "uuid": "",
        "url": "",
        "hits": 0,
        "offer_id": "",
        "offer_name": "",
        "full_url": "",
        "replacement_links": "",
        "split_test_links": null,
        "split_test": 0,
        "daily_hits": 0,
        "notes": null,
        "redirect_rate": 0,
        "date_ripped": "",
        "last_updated": "",
        "country_dist": ""
      },

      validation: {
        redirect_rate: {
          required: true,
          range: [0, 100]
        },
        offer_name: {
          required: true
        },
        offer_id: {
          required: true  
        }
      }

    });

    GetRips.NewRip = Backbone.Model.extend({
      events: {},
      defaults: {
        "url": ""
      },
    });

    GetRips.RipCollection = Backbone.Collection.extend({
      url: "/ripped",
      model: GetRips.Rip
    });

    GetRips.NewRipCollection = Backbone.Collection.extend({
      url: "/new_ripped",
      model: GetRips.NewRip
    });

    var API = {
      getRips: function(){
        var rips = new GetRips.RipCollection();
        var defer = $.Deferred();
        rips.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        return promise;
      },
      getNewRips: function(){
        var rips = new GetRips.NewRipCollection();
        var defer = $.Deferred();
        rips.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        return promise;
      },
    };

    RipManager.reqres.setHandler("rips:getrips", function(){
      return API.getRips();
    });
   
    RipManager.reqres.setHandler("rips:getnewrips", function(){
      return API.getNewRips();
    });


  });

});
