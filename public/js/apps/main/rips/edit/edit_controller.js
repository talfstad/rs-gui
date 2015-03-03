define(["app", "apps/main/rips/edit/edit_view"], function(RipManager, View){
  RipManager.module("RipsApp.Edit", function(Edit, RipManager, Backbone, Marionette, $, _){
    Edit.Controller = {
      editRip: function(id){
        require(["common/views", "entities/rip"], function(CommonViews){
          
          var fetchingRip = RipManager.request("rip:entity", id);
          
          $.when(fetchingRip).done(function(rip){
            var view;
            if(rip !== undefined){
              view = new View.Rip({
                model: rip,
                generateTitle: true
              });

              view.on("form:submit", function(data){
                if(rip.save(data)){
                  RipManager.trigger("rip:show", rip.get('id'));
                }
                else{
                  view.triggerMethod("form:data:invalid", rip.validationError);
                }
              });
            }
            else{
              view = new RipManager.RipsApp.Show.MissingRip();
            }

            RipManager.mainRegion.show(view);
          });
        });
      }
    };
  });

  return RipManager.RipsApp.Edit.Controller;
});
