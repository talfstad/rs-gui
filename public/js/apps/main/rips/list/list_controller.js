define(["app", "apps/main/rips/list/list_view"], function(RipManager, RipsListView){
  RipManager.module("RipsApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listRips: function(criterion){
        require(["apps/main/rips/list/list_model"], function(getRipsModel){
        
          var fetchingRips = RipManager.request("rips:getrips");

          var ripsListLayout = new RipsListView.RipsListLayout();

          $.when(fetchingRips).done(function(rips){
            
            var ripsListView = new RipsListView.Rips({
              collection: rips
            });

            //first check if main application has loaded, must load that first
            //it sets up some main things for the main app including left nav
            //the main layout, etc.
            require(["apps/main/rips/edit/edit_view"], function(EditRipView){
              ripsListView.on("childview:rip:edit", function(viewTestTodo, args){
                var model = args.model;
                var view = new EditRipView.Rip({
                  model: model
                });

                view.on("rip:edit:submit", function(data){
                  if(model.save(data)){
                    viewTestTodo.render();
                    view.trigger("dialog:close");
                  } 
                  else{
                    view.triggerMethod("form:data:invalid", model.validationError);
                  }
                });

                ripsListLayout.dialogRegion.show(view);
              });
            });
            

            RipManager.mainLayout.mainRegion.show(ripsListLayout);
            ripsListLayout.ripsTableRegion.show(ripsListView);
          });
        });
      }
    }
  });

  return RipManager.RipsApp.List.Controller;
});