define(["app", "apps/main/landers/list/list_view", "backbone.syphon"], function(RipManager, LandersListView){
  RipManager.module("LandersApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listLanders: function(criterion){
        require(["apps/main/landers/list/list_model", "apps/main/landers/upload/upload_model",
                 "common/loading_view"], function(getLanderssModel, uploadModel, LoadingView){

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
            RipManager.on("lander:upload:submit", function(model){
              //add date_created, user, remove files
              model.date_created = new Date().toString();
              model.last_updated = new Date().toString();
              model.user = RipManager.session.attributes.user;
              model.ready = 0;
              delete model['files'];

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

              view.on("notes:edit:submit", function(){
                var data = Backbone.Syphon.serialize(this);

                //create a new model, with the new data submit it with correct uuid
                model.set({notes: data.notes});
                
                if(model.isValid(true)) {
                  model.save(data, {success: saveLanderSuccess, error: saveLanderError});
                  view.closeDialog();
                } else {
                  model.set(model.previousAttributes());
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