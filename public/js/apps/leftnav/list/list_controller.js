define(["app", "apps/leftnav/list/list_view"], function(RipManager, View){
  RipManager.module("LeftNavApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listLeftNav: function(){
        var leftNav = new View.LeftNav({});
        RipManager.leftNavRegion.show(leftNav);
      }//,

      // setActiveHeader: function(headerUrl){
      //   var links = RipManager.request("header:entities");
      //   var headerToSelect = links.find(function(header){ return header.get("url") === headerUrl; });
      //   headerToSelect.select();
      //   links.trigger("reset");
      // }
    };
  });

  return RipManager.LeftNavApp.List.Controller;
});