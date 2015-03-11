define(["app", "apps/main/rips/edit/edit_view"], function(RipManager, View){
  RipManager.module("RipsApp.Edit", function(Edit, RipManager, Backbone, Marionette, $, _){
    Edit.Controller = {
      editRip: function(id){
        require(["apps/main/rips/common/views", "entities/rip"], function(CommonViews){
          
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
      },

      submitEdit: function(data){
        require(["apps/main/rips/edit/edit_model"], function() {

          //get data!
          var submitEdit = RipManager.request("model:rip:submit", data);

          $.when(submitEdit).done(function(response){
            var newModel = response.attributes.model;
            var successMessage = response.attributes.success;

          });

        });
      }
    };
  });

  return RipManager.RipsApp.Edit.Controller;
});
