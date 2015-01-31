define(["app", "apps/main/rips/list/list_view", "apps/main/leftnav/list/list_view"], function(RipManager, RipsListView, LeftNavView){
  RipManager.module("RipsApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listRips: function(criterion){
        require(["entities/rip", "apps/main/leftnav/list/list_view"], function(){
        
          var fetchingRips = RipManager.request("rip:entities");

          var ripsListLayout = new RipsListView.Layout();
          

            $.when(fetchingRips).done(function(rips){
              var leftNav = new LeftNavView.LeftNav();
              
              var ripsListView = new RipsListView.Rips({
                collection: rips
              });

              ripsListLayout.on("show", function(){
                ripsListLayout.leftNavRegion.show(leftNav);
                ripsListLayout.ripsRegion.show(ripsListView);
              });

              RipManager.mainRegion.show(ripsListLayout);
            });
        });
      }
    }
  });

  return RipManager.RipsApp.List.Controller;
});
