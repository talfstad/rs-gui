define(["app", "apps/main/rips/show/show_view"], function(RipManager, View){
  RipManager.module("RipsApp.Show", function(Show, RipManager, Backbone, Marionette, $, _){
    Show.Controller = {
      showRip: function(id){
        require(["common/views", "entities/rip"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: "Artificial Loading Delay",
            message: "Data loading is delayed to demonstrate using a loading view."
          });
          RipManager.mainRegion.show(loadingView);

          var fetchingRip = RipManager.request("rip:entity", id);
          $.when(fetchingRip).done(function(rip){
            var ripView;
            if(rip !== undefined){
              ripView = new View.Rip({
                model: rip
              });

              ripView.on("rip:edit", function(rip){
                RipManager.trigger("rip:edit", rip.get("id"));
              });
            }
            else{
              ripView = new View.MissingRip();
            }

            RipManager.mainRegion.show(ripView);
          });
        });
      }
    }
  });

  return RipManager.RipsApp.Show.Controller;
});
