define(["app"], function(RipManager){
  RipManager.module("LeftNavApp.Model", function(Model, RipManager, Backbone, Marionette, $, _){

    Model.leftNavLink = Backbone.Model.extend({
      defaults: {
        active: false
      }
    });

    Model.leftNavLinkCollection = Backbone.Collection.extend({
      model: Model.leftNavLink
    });

    var initializeLinks = function(){
      Model.links = new Model.leftNavLinkCollection([
        { name: "Dashboard", url: "dash", icon: "fa fa-dashboard", children: false, navigationTrigger: "dash:list" },
        { name: "Rips", url: "rips", icon: "fa fa-line-chart", children: false, navigationTrigger: "rips:list" },
        { 
          name: "Offers", 
          url: "offers", 
          icon: "fa fa-shopping-cart", 
          navigationTrigger: "offers:list",
          children: {
            // offers_edit: { name: "Edit", url: "offers/edit", icon: "fa fa-edit", navigationTrigger: "offers:list" },
            offers_new: { name: "New", url: "offers/new", icon: "fa fa-plus-square-o", navigationTrigger: "offers:new" }
          }
        }
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