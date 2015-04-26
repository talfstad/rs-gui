define(["app", "apps/main/landers/list/list_view"], function(RipManager, LandersListView){
  RipManager.module("LandersApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listLanders: function(criterion){
        require(["apps/main/landers/list/list_model",
                 "common/loading_view"], function(getLanderssModel, LoadingView){

          var landersListLayout = new LandersListView.LandersListLayout();
          landersListLayout.render();

          RipManager.mainLayout.mainRegion.show(landersListLayout);

          landersListLayout.landersTableRegion.show(new LoadingView.Loading());

          var fetchingLanders = RipManager.request("landers:getlanders");
          $.when(fetchingLanders).done(function(landers){
            
            var landersListView = new LandersListView.Landers({
              collection: landers
            });


            //add new landers into the grid
            RipManager.on("landers:new:add", function(model){
              landers.add(model);
              landers.trigger("reset");
              landersListView.trigger("landers:new:add");
            });

            var saveLanderSuccess = function(model, message, other) {
              landersListView.trigger("landers:edit:notify", "Success", "success");
            };

            var saveLanderError = function(model, message, other) {
              landersListView.trigger("landers:edit:notify", message.error, "danger");
              model.set(model.previousAttributes());
            };
            
            landersListView.on("childview:landers:delete", function(childView, model) {
              //show a are you sure? dialog, on OK call destroy()
              model.destroy();
            });

            try {
              landersListLayout.landersTableRegion.show(landersListView);
            } catch(e){}
            
          });
        });
      }
    }
  });

  return RipManager.LandersApp.List.Controller;
});