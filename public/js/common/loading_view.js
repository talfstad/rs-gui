define(["app", "tpl!common/loading.tpl"],
function(RipManager, loadingTpl){

  RipManager.module("Common.LoadingView", function(Views, RipManager, Backbone, Marionette, $, _){
    Views.Loading = Marionette.ItemView.extend({
      template: loadingTpl,
      className: "glyphicon glyphicon-refresh glyphicon-refresh-animate loading",

      title: "Loading Data",
      message: "Please wait, data is loading.",

      serializeData: function(){
        return {
          title: Marionette.getOption(this, "title"),
          message: Marionette.getOption(this, "message")
        }
      },

      onShow: function(){
        
      }
    });
  });
  
  return RipManager.Common.LoadingView
});