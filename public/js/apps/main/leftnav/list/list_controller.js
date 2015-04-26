define(["app", "apps/main/leftnav/list/list_view",
        "apps/main/leftnav/models/leftnav_model",
        "apps/main/dashboard/dashboard_app",
        "apps/main/offers/offers_app",
        "apps/main/registered/registered_app",
        "apps/main/landers/landers_app",
        "apps/main/rips/rips_app"], function(RipManager, View, leftNavModel){
  RipManager.module("LeftNavApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      
      leftNavView: null,


      listLeftNav: function(){
        var links = RipManager.request("leftNav:links"); // get collection for links
        this.leftNavView = new View.LeftNav({collection: links});

        this.leftNavView.on("childview:navigate", function(childView, model, child) {
          if(child){
            children = model.get("children");
            var childModel = children[child];
            RipManager.trigger(childModel.navigationTrigger);
          } else {
            // var trigger = model.get("navigationTrigger");
            var url = model.get("url");
            RipManager.navigate(url, {trigger: true});
          }
        });

        RipManager.mainLayout.leftNavRegion.show(this.leftNavView);    
      },

      
      setActiveLeftNav: function(url){
        var links = RipManager.request("leftNav:links"); // get collection for links
        
        //iterate through all links turn
        links.each(function(link){
          if(link.get("url") === url) {
            link.attributes.active = true;
          } else {
            link.attributes.active = false;
          }
        });
        links.trigger("reset");
        // this.leftNavView.onDomRefresh();
      }
    };
 
  });

  return RipManager.LeftNavApp.List.Controller;
});