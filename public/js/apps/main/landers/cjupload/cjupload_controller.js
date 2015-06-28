define(["app", "apps/main/landers/cjupload/cjupload_view",
        "apps/main/landers/cjupload/cjupload_model",
        "bootstrap-dialog"],
        function(RipManager, UploadLanderView, UploadModel){
  RipManager.module("LandersApp.CJUpload", function(New, RipManager, Backbone, Marionette, $, _){
    New.Controller = {
      uploadLander: function(itemArgs){
        var childView = null, args = null;
        if(itemArgs) {
          childView = itemArgs.childView;
          args = itemArgs.args;
        }

        var uploadModel = itemArgs.childView.model;

        var view = new UploadLanderView.UploadDialogForm({
          model: uploadModel
        });

        var uploadLanderSuccess = function(model, message, other) {
          RipManager.trigger("cjupload:add", model);
          view.trigger("cjupload:notify", "Success", "success", model);
        };

        var uploadLanderError = function(model, message, other) {
          view.trigger("cjupload:notify", message.error, "danger");
          model.set(model.previousAttributes());
        };
        
        view.showDialog();
        
        view.on("close", function(){
          args.view.trigger("remove:highlightrow");
        });
      },
    };
  });

  return RipManager.LandersApp.CJUpload.Controller;
});
