define(["app"], function(RipManager){
  RipManager.module("GetRegistered", function(GetRegistered, RipManager, Backbone, Marionette, $, _){
    

    GetRegistered.Registered = Backbone.Model.extend({
      defaults: {
        id: 0,
        links_list: "",
        user: "",
        archive_path: "",
        uuid: "",
        url: "",
        hits: 0,
        rips: 0,
        domain: "",
        date_created: null,
        last_updated: null,
        notes: null
      }
    });

    GetRegistered.RegisteredCollection = Backbone.Collection.extend({
      url: "/lander_info",
      model: GetRegistered.Registered
    });

    var API = {
      getRegistered: function(){
        var registered = new GetRegistered.RegisteredCollection();
        var defer = $.Deferred();
        registered.fetch({
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
  return RipManager.GetRegistered;
});
