define(["app", "tpl!apps/main/offers/new/new_offer.tpl", 
        "bootstrap-dialog", 
        "backbone.syphon", 
        "backbone-validation", 
        "datatablesbootstrap",
        "bootstrap-select"], function(RipManager, OfferEditFormTpl, BootstrapDialog){
  RipManager.module("OffersApp.NewDialog.View", function(View, RipManager, Backbone, Marionette, $, _){

      View.NewDialogForm = Marionette.ItemView.extend({
        template: OfferEditFormTpl,
        
        triggers: {
          "click button.js-close" : "close"
        },

        initialize: function() {
          this.listenTo(this, "offer:new:notify", this.notify);
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

        onRender: function() {
          this.$el.find(".user-select").selectpicker('render');
        },

        showDialog: function(e){
          var me = this;
          this.render();

          BootstrapDialog.show({
            type: BootstrapDialog.TYPE_PRIMARY,
            title: '<h5><strong>New Offer</strong></h5>',
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
              label: 'Add Offer',
              cssClass: 'btn-primary',
              hotkey: 13, //Enter key
              action: function(dialogRef) {
                  me.submitOfferNew();
              }
            }],
            draggable: true
          });
        },

        submitOfferNew: function() {
          var data = Backbone.Syphon.serialize(this);
          data.id = this.model.attributes.id;
          this.model.set(data);
          this.trigger("offer:new:submit", data);
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

        notify: function(data, type, model) {
          var me = this;
          var notifyOptions = {
            icon: 'glyphicon glyphicon-refresh glyphicon-refresh-animate',
            title: "Saving Offer: ",
            message: "",
            // url: 'https://github.com/mouse0270/bootstrap-notify',
            //target: '_blank'
          };

          var otherOptions = {
            // settings
            element: 'body',
            position: null,
            type: type,
            allow_dismiss: true,
            newest_on_top: false,
            placement: {
              from: "top",
              align: "right"
            },
            offset: 20,
            spacing: 10,
            z_index: 1031,
            delay: 1,
            timer: 800,
            url_target: '_blank',
            mouse_over: null,
            animate: {
              enter: 'animated fadeInDown',
              exit: 'animated fadeOutUp'
            },
            onShow: null,
            onShown: null,
            onClose: null,
            onClosed: null,
            icon_type: 'class',
            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
              '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
              '<span data-notify="icon"></span> ' +
              '<span data-notify="title">{1}</span> ' +
              '<span data-notify="message">{2}</span>' +
              '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
              '</div>' +
              // '<a href="{3}" target="{4}" data-notify="url"></a>' +
            '</div>' 
          };

          if(type=="danger"){
            notifyOptions.title = "<strong>Failed to Save Offer</strong> <br />Please Stand by, one of our surfer dude coder guys will investigate this shortly.";
            notifyOptions.icon = "glyphicon glyphicon-warning-sign";
            otherOptions.delay = 0;
          } 

          var notify = $.notify(notifyOptions,otherOptions);


          setTimeout(function() {
            notify.update('message', data);
          }, 850);


        },

        serializeData: function(){
          return {
            model: this.model.toJSON(),
            userList: this.options.userList.toJSON()
          };
        }

        
        

      });
  });

  return RipManager.OffersApp.NewDialog.View;
});