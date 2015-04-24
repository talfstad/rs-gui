define(["app", "apps/main/registered/list/list_view"], function(RipManager, RegisteredListView){
  RipManager.module("RegisteredApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listRegistered: function(criterion){
        require(["apps/main/registered/list/list_model",
                 "common/loading_view"], function(getRegisteredModel, LoadingView){

          var registeredListLayout = new RegisteredListView.RegisteredListLayout();
          registeredListLayout.render();

          RipManager.mainLayout.mainRegion.show(registeredListLayout);

          var loadingView = new LoadingView.Loading();
          registeredListLayout.registeredTableRegion.show(loadingView);

          var fetchingRegistered = RipManager.request("registered:getregistered");
          $.when(fetchingRegistered).done(function(registeredCollection){
            
            var registeredListView = new RegisteredListView.RegisteredListView({
              collection: registeredCollection
            });

            
            registeredListView.on("childview:unregister", function(childView, model) {
              //confirm dialog before unregistering domain

              //unregister!
            });

            try {
              registeredListLayout.registeredTableRegion.show(registeredListView);
            } catch(e){}
            
          });
        });
      }
    }
  });

  return RipManager.RegisteredApp.List.Controller;
});