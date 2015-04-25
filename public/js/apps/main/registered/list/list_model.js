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

    GetRegistered.Unregister = Backbone.Model.extend({
      url: '/unregister_domain',
      defaults: {
        url: ''
      }
    });

    GetRegistered.RegisteredCollection = Backbone.Collection.extend({
      url: "/lander_info",
      model: GetRegistered.Registered,

      getModelsWithDomain: function(domain){
        filtered = this.filter(function(registeredModel) {
          return registeredModel.get("domain") === domain;
        });
      
        return filtered;
      }
    });

    //General model to use
    GetRegistered.Model = Backbone.Model.extend({
      defaults: {}
    });

    GetRegistered.RegisteredHitsCollection = Backbone.Collection.extend({
      url: "/registered_hits_for_n_days?n=30",
      model: GetRegistered.Model
    });

    var API = {
      getRegisteredHitsGraph: function(args){
        var registeredHitsGraphData = new GetRegistered.RegisteredHitsCollection();
        var defer = $.Deferred();
        registeredHitsGraphData.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        return promise;
      },
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

    RipManager.reqres.setHandler("registered:graph", function(args){
      return API.getRegisteredHitsGraph(args);
    });


    RipManager.reqres.setHandler("registered:getregistered", function(){
      return API.getRegistered();
    });
   
  });
  return RipManager.GetRegistered;
});
