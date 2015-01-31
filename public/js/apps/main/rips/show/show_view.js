define(["app",
        "tpl!apps/main/rips/show/templates/missing.tpl",
        "tpl!apps/main/rips/show/templates/view.tpl"],
       function(RipManager, missingTpl, viewTpl){
  RipManager.module("RipsApp.Show.View", function(View, RipManager, Backbone, Marionette, $, _){
    View.MissingRip = Marionette.ItemView.extend({
      template: missingTpl
    });

    View.Rip = Marionette.ItemView.extend({
      template: viewTpl,

      events: {
        "click a.js-edit": "editClicked"
      },

      editClicked: function(e){
        e.preventDefault();
        this.trigger("rip:edit", this.model);
      }
    });
  });

  return RipManager.RipsApp.Show.View;
});
