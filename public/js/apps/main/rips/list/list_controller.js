define(["app", "apps/main/rips/list/list_view"], function(RipManager, RipsListView){
  RipManager.module("RipsApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listRips: function(criterion){
        require(["entities/rip"], function(){
        
          var fetchingRips = RipManager.request("rip:entities");

          $.when(fetchingRips).done(function(rips){
            
            var ripsListView = new RipsListView.Rips({
              collection: rips
            });

            //first check if main application has loaded, must load that first
            //it sets up some main things for the main app including left nav
            //the main layout, etc.
            
            

            RipManager.mainLayout.on("show", function(){
              RipManager.mainLayout.mainRegion.show(ripsListView);
            });

            RipManager.mainLayout.mainRegion.show(ripsListView);



          });
        });
      }
    }
  });

  return RipManager.RipsApp.List.Controller;
});