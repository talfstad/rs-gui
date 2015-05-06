define(["app", "apps/main/landers/upload/upload_view",
        "apps/main/landers/list/list_controller",
        "apps/main/landers/upload/upload_model",
        "bootstrap-dialog"],
        function(RipManager, UploadLanderView, ListController, UploadModel){
  RipManager.module("LandersApp.Upload", function(New, RipManager, Backbone, Marionette, $, _){
    New.Controller = {
      uploadLander: function(){
        var uploadModel = new UploadModel.Upload();

        var view = new UploadLanderView.UploadDialogForm({
          model: uploadModel
        });

        var uploadLanderSuccess = function(model, message, other) {
          RipManager.trigger("lander:upload:add", model);
          view.trigger("lander:upload:notify", "Success", "success", model);
        };

        var uploadLanderError = function(model, message, other) {
          view.trigger("lander:upload:notify", message.error, "danger");
          model.set(model.previousAttributes());
        };
        
        view.showDialog();
        
      },
    };
  });

  return RipManager.LandersApp.Upload.Controller;
});
