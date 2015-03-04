define(["app"], function(RipManager){
  RipManager.module("GetRips", function(GetRips, RipManager, Backbone, Marionette, $, _){
    GetRips.Rip = Backbone.Model.extend({
      urlRoot: "/API/rips",

      defaults: {
        "id": "",
        "links_list": "",
        "user": "",
        "uuid": "",
        "url": "",
        "hits": 0,
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
      }
    });

    GetRips.RipCollection = Backbone.Collection.extend({
      url: "/ripped",
      model: GetRips.Rip
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
      }

    };

    RipManager.reqres.setHandler("rips:getrips", function(){
      return API.getRips();
    });
   
  });

  return ;
});
