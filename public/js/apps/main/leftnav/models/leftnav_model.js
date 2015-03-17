define(["app"], function(RipManager){
  RipManager.module("LeftNavApp.Model", function(Model, RipManager, Backbone, Marionette, $, _){

    Model.leftNavLink = Backbone.Model.extend({});

    Model.leftNavLinkCollection = Backbone.Collection.extend({
      model: Model.leftNavLink
    });

    var initializeLinks = function(){
      Model.links = new Model.leftNavLinkCollection([
        { name: "Daily Overview", url: "dash", icon: "fa fa-dashboard", navigationTrigger: "dash:list" },
        { name: "Rips", url: "rips", icon: "fa fa-heartbeat", navigationTrigger: "rips:list" }
      ]);
    };

    var API = {
      getLinks: function(){
        if(Model.links === undefined){
          initializeLinks();
        }
        return Model.links;
      }
    };

    RipManager.reqres.setHandler("leftNav:links", function(){
      return API.getLinks();
    });

   return RipManager.LeftNavApp.Model.leftNavLinkCollection; 
  });
});