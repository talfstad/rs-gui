define(["app", "apps/main/leftnav/list/list_view",
        "apps/main/leftnav/models/leftnav_model"], function(RipManager, View, leftNavModel){
  RipManager.module("LeftNavApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      


      listLeftNav: function(){
        var links = RipManager.request("leftNav:links"); // get collection for links
        var leftNav = new View.LeftNav({collection: links});

        leftNav.on("childview:navigate", function(childView, model) {
          var trigger = model.get("navigationTrigger");
          RipManager.trigger(trigger);
        });

        RipManager.mainLayout.leftNavRegion.show(leftNav);
      
      },

      
      setActiveLeftNav: function(url){
        var links = RipManager.request("leftNav:links"); // get collection for links

        var leftNavToSelect = links.find(function(header){ return header.get("url") === url; });
        
        //iterate through all links turn
        links.each(function(link){
          if(link.get("url") === url) {
            link.attributes.active = true;
          } else {
            link.attributes.active = false;
          }
        });
        links.trigger("reset");


        // // headerToSelect.addClass("active");
        // links.trigger("reset");
      }
    };
  });

  return RipManager.LeftNavApp.List.Controller;
});