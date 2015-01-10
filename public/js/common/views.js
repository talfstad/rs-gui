define(["app", "tpl!common/templates/loading.tpl"], function(ContactManager, loadingTpl){
  ContactManager.module("Common.Views", function(Views, ContactManager, Backbone, Marionette, $, _){
    Views.Loading = Marionette.ItemView.extend({
      template: loadingTpl,

      title: "Loading Data",
      message: "Please wait, data is loading.",

      serializeData: function(){
        return {
          title: Marionette.getOption(this, "title"),
          message: Marionette.getOption(this, "message")
        }
      },

      onShow: function(){
        //removed spinner
      }
    });
  });

  return ContactManager.Common.Views;
});
