define(["app", "apps/header/list/list_view"], function(RipManager, View){
  RipManager.module("HeaderApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listHeader: function(){
        require(["entities/authentication", "entities/header", "authentication/authentication_app"], function(Entities){
          // var links = RipManager.request("header:entities");
          var header = new View.Header({
            model: RipManager.session
          });

          header.on("logout:clicked", function(){
            RipManager.trigger("authentication:logout");
          });

          // headers.on("childview:navigate", function(childView, model){
          //   var trigger = model.get("navigationTrigger");
          //   RipManager.trigger(trigger);
          // });

          RipManager.headerRegion.show(header);
        });
      }//,

      // setActiveHeader: function(headerUrl){
      //   var links = RipManager.request("header:entities");
      //   var headerToSelect = links.find(function(header){ return header.get("url") === headerUrl; });
      //   headerToSelect.select();
      //   links.trigger("reset");
      // }
    };
  });

  return RipManager.HeaderApp.List.Controller;
});
