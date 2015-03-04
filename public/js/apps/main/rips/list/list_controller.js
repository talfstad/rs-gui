define(["app", "apps/main/rips/list/list_view"], function(RipManager, RipsListView){
  RipManager.module("RipsApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listRips: function(criterion){
        require(["apps/main/rips/list/list_model"], function(getRipsModel){
        
          var fetchingRips = RipManager.request("rips:getrips");

          $.when(fetchingRips).done(function(rips){
            
            var ripsListView = new RipsListView.Rips({
              ripsCollection: rips.models[0].attributes.rows
            });

            //first check if main application has loaded, must load that first
            //it sets up some main things for the main app including left nav
            //the main layout, etc.
            
            RipManager.mainLayout.mainRegion.show(ripsListView);



          });
        });
      }
    }
  });

  return RipManager.RipsApp.List.Controller;
});