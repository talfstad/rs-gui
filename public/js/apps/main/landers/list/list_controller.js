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
            
            landersListView.on("childview:notes:edit", function(childView, args) {
              var model = args.model;
              var view = new LandersListView.EditNotesView({
                model: model
              });

              view.on("notes:edit:submit", function(data){
                
                if(this.model.isValid(true)) {
                  model.save(data, {success: saveOfferSuccess, error: saveOfferError});
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