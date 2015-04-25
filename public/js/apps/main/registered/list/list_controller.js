define(["app", "apps/main/registered/list/list_view"], function(RipManager, RegisteredListView){
  RipManager.module("RegisteredApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listRegistered: function(criterion){
        require(["apps/main/registered/list/list_model",
                 "common/loading_view"], function(GetRegisteredModel, LoadingView){

          var registeredListLayout = new RegisteredListView.RegisteredListLayout();
          registeredListLayout.render();

          RipManager.mainLayout.mainRegion.show(registeredListLayout);

          registeredListLayout.registeredGraphRegion.show(new LoadingView.Loading());
          registeredListLayout.registeredTableRegion.show(new LoadingView.Loading());

          var fetchingRegisteredGraphData = RipManager.request("registered:graph");
          $.when(fetchingRegisteredGraphData).done(function(graphData){
            
            var registeredGraphView = new RegisteredListView.RegisteredHitsGraph({
              registeredHitsGraph: graphData.models
            });

            registeredListLayout.registeredGraphRegion.show(registeredGraphView);
          });

          var fetchingRegistered = RipManager.request("registered:getregistered");
          $.when(fetchingRegistered).done(function(registeredCollection){
            
            var registeredListView = new RegisteredListView.RegisteredListView({
              collection: registeredCollection
            });

            
            registeredListView.on("childview:unregister", function(childView, args) {
              var model = args.model;

              var unregisterDialogView = new RegisteredListView.UnregisterDialogView({
                model: model
              });

              var saveUnregisterSuccess = function(model, message, other) {
                registeredListView.trigger("unregister:notify", "Success", "success");
                //remove all things with this domain
                var toRemove = registeredCollection.getModelsWithDomain(unregisterDialogView.model.attributes.domain);
                $.each(toRemove, function(idx,domainModel){
                  registeredCollection.remove(domainModel);
                });
              };

              var saveUnregisterError = function(model, message, other) {
                registeredListView.trigger("unregister:notify", "Error", "danger");
              };

              unregisterDialogView.on("unregister:submit", function(data){
                var unregisterModel = new GetRegisteredModel.Unregister();
                var data = {};
                data.url = model.attributes.url;
                unregisterModel.set(data);
                unregisterModel.save(data, {success: saveUnregisterSuccess, error: saveUnregisterError});
                
                unregisterDialogView.closeDialog();
              });

              unregisterDialogView.on("close", function(){
                args.view.trigger("remove:highlightrow");
              });

                unregisterDialogView.showDialog();
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