define(["app", "apps/main/rips/list/list_view"], function(RipManager, RipsListView){
  RipManager.module("RipsApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listRips: function(criterion){
        require(["apps/main/rips/list/list_model",
                 "common/loading_view"], function(getRipsModel, LoadingView){

          var ripsListLayout = new RipsListView.RipsListLayout();
          ripsListLayout.render();

          RipManager.mainLayout.mainRegion.show(ripsListLayout);

          var loadingView = new LoadingView.Loading();
          ripsListLayout.ripsTableRegion.show(loadingView);

          var fetchingRips = RipManager.request("rips:getrips");
          $.when(fetchingRips).done(function(rips){
            
            var ripsListView = new RipsListView.Rips({
              collection: rips
            });

            var saveRipSuccess = function(model, message, other) {
              ripsListView.trigger("rip:edit:notify", message.success, "success");
            };

            var saveRipError = function(model, message, other) {
              ripsListView.trigger("rip:edit:notify", message.error, "danger");
              model.set(model.previousAttributes());
            };

            //first check if main application has loaded, must load that first
            //it sets up some main things for the main app including left nav
            //the main layout, etc. TODO
            require(["apps/main/rips/edit/edit_view"], function(EditRipView){
              ripsListView.on("childview:rip:edit", function(viewTestTodo, args){

                var model = args.model;
                var view = new EditRipView.Rip({
                  model: model
                });

                view.on("rip:edit:submit", function(data){
                  
                  if(this.model.isValid(true)) {
                    model.save(data, {success: saveRipSuccess, error: saveRipError});
                    view.closeDialog();
                  } else {
                    //TODO This doesn't contain the actual previous attr right now
                    //because of the validation (i think)
                    view.model.set(view.model.previousAttributes());
                  }
                  
                });


                view.on("close", function(){
                  args.view.trigger("remove:highlightrow");
                });

                view.showDialog();

              });
            });
            

            try {
              ripsListLayout.ripsTableRegion.show(ripsListView);
            } catch(e){}
            
          });
        });
      }
    }
  });

  return RipManager.RipsApp.List.Controller;
});