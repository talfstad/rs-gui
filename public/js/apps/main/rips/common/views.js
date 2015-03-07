define(["app", "tpl!apps/main/rips/common/rip-edit-form.tpl", "backbone.syphon"], function(RipManager, RipEditFormTpl){
  RipManager.module("RipsApp.Common.View", function(View, RipManager, Backbone, Marionette, $, _){

      View.EditDialogForm = Marionette.ItemView.extend({
        template: RipEditFormTpl,

        events: {
          "click button.js-submit": "submitClicked"
        },

        submitClicked: function(e){
          
            e.preventDefault();
            var data = Backbone.Syphon.serialize(this);
            data.id = this.model.attributes.id;
            this.trigger("rip:edit:submit", data);
          
        },

        onFormDataInvalid: function(errors){
          var $view = this.$el;

          var clearFormErrors = function(){
            var $form = $view.find("form");
            $form.find(".help-inline.error").each(function(){
              $(this).remove();
            });
            $form.find(".control-group.error").each(function(){
              $(this).removeClass("error");
            });
          }

          var markErrors = function(value, key){
            var $controlGroup = $view.find("#contact-" + key).parent();
            var $errorEl = $("<span>", { class: "help-inline error", text: value });
            $controlGroup.append($errorEl).addClass("error");
          }

          clearFormErrors();
          _.each(errors, markErrors);
        }
      });
  });

  return RipManager.RipsApp.Common.View;
});