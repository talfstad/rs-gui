define(["app", "tpl!apps/main/rips/dialog/rip-edit-form.tpl", "bootstrap-dialog", "backbone.syphon", "backbone-validation", "bootstrap-select"], function(RipManager, RipEditFormTpl, BootstrapDialog){
  RipManager.module("RipsApp.Common.View", function(View, RipManager, Backbone, Marionette, $, _){

      View.EditDialogForm = Marionette.ItemView.extend({
        template: RipEditFormTpl,
        
        initialize: function() {
          Backbone.Validation.bind(this,{
            valid: function (view, attr, selector) {
              var $el = view.$('[name=' + attr + ']'), 
              $group = $el.closest('.form-group');
          
              $group.removeClass('has-error');
              $group.find('.help-block').html('').addClass('hidden');
            },
            invalid: function (view, attr, error, selector) {
              var $el = view.$('[name=' + attr + ']'), 
              $group = $el.closest('.form-group');
          
              $group.addClass('has-error');
              $group.find('.help-block').html(error).removeClass('hidden');
            }
          });
        },

        triggers: {
          "click button.js-close" : "close"
        },

        showDialog: function(e){
          var me = this;
          this.render();

          BootstrapDialog.show({
            type: BootstrapDialog.TYPE_PRIMARY,
            title: '<h5><strong>Edit Rip:</strong> ' + this.model.attributes.url + '</h5>',
            message: this.$el,
            cssClass: 'login-dialog',
            onhide: function(dialogRef){
              me.trigger("close");
            },
            buttons: [{
              label: 'Close',
              action: function(dialogRef) {
                  dialogRef.close();
              }
            },
            {
              label: 'Update Rip',
              cssClass: 'btn-primary',
              hotkey: 13, //Enter key
              action: function(dialogRef) {
                  me.submitRipEdit();
              }
            }],
            draggable: true
          });
        },

        onRender: function() {
          this.$el.find(".offer-select").val(this.model.attributes.offer_id).selectpicker('render');

        },

        submitRipEdit: function() {
          var data = Backbone.Syphon.serialize(this);
          data.id = this.model.attributes.id;
          data.offer_name = this.options.offerList.get(data.offer_id).attributes.name;
          data.replacement_links = this.options.offerList.get(data.offer_id).attributes.offer_link;
          this.model.set(data);
          this.trigger("rip:edit:submit", data);
        },

        closeDialog: function(e){
          BootstrapDialog.closeAll();
        },

        remove: function() {
          // Remove the validation binding
          // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
          Backbone.Validation.unbind(this);
          return Backbone.View.prototype.remove.apply(this, arguments);
        },

        serializeData: function(){
          return {
            model: this.model.toJSON(),
            offerList: this.options.offerList.toJSON()
          };
        }

        

      });
  });

  return RipManager.RipsApp.Common.View;
});