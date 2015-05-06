define(["app", "tpl!apps/main/landers/upload/upload_lander.tpl", 
        "bootstrap-dialog", 
        "backbone.syphon", 
        "backbone-validation", 
        "datatablesbootstrap",
        'tmpl', 'load-image', 'canvas-to-blob', 'jquery.iframe-transport', 'jquery.fileupload-ui' //file upload shit
        ], function(RipManager, uploadTpl, BootstrapDialog){
  RipManager.module("LandersApp.UploadDialog.View", function(View, RipManager, Backbone, Marionette, $, _){

      View.UploadDialogForm = Marionette.ItemView.extend({
        template: uploadTpl,
        lander: {},
        
        initialize: function() {
          this.lander.valid = false; //init lander upload to not valid

          this.listenTo(this, "lander:upload:notify", this.notify);
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
            title: '<h5><strong>Upload a New Lander</strong></h5>',
            message: this.$el,
            cssClass: 'login-dialog',
            onshown: function(dialogRef){
              me.initializeFileUpload();
            },
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
              label: 'Upload Lander',
              cssClass: 'btn-primary',
              action: function(e) {
                  me.submitLanderUpload(e);
              }
            }],
            draggable: true
          });
        },

        initializeFileUpload: function(){
          var me = this;

          // Initialize the jQuery File Upload widget:
          $('#fileupload').fileupload({
              // Uncomment the following to send cross-domain cookies:
              xhrFields: {withCredentials: true},
              url: '/upload',
              autoUpload: false,
              maxNumberOfFiles: 1,
              singleFileUploads: true,
              acceptFileTypes: /(\.|\/)(zip)$/i,
              done: function(e, data){
                me.onDoneUploadingLander(e, data);
              }
          });


          // On file add assigning the name of that file to the variable to pass to the web service
          $('#fileupload').bind('fileuploadadd', function (e, data) {
            me.lander = data;
          });

          $('#fileupload').bind('fileuploadprocessfail', function(e, data){
            me.lander.valid = false;
          });

          $('#fileupload').bind('fileuploadprocessdone', function(e, data){
            me.lander.valid = true;
          });

          
        },

        submitLanderUpload: function(e) {
          var data = Backbone.Syphon.serialize(this);
          this.model.set({notes: data.notes});
          // this.trigger("lander:upload:submit", data);
          if(this.lander.valid && this.model.isValid(true)){
            this.lander.formData = {notes: data.notes};
            this.lander.submit();
          }

        },

        onDoneUploadingLander: function(e, data){
          this.closeDialog();
          this.notify("Success", "success");
          RipManager.trigger("lander:upload:submit", data.response().result);
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
            title: "Saving Lander: ",
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
            notifyOptions.title = "<strong>Failed to Save Lander</strong> <br />Failed to save Lander due to global warming.";
            notifyOptions.icon = "glyphicon glyphicon-warning-sign";
            otherOptions.delay = 0;
          }

          var notify = $.notify(notifyOptions,otherOptions);

          setTimeout(function() {
            notify.update('message', data);
          }, 850);
        }
      });
  });

  return RipManager.LandersApp.UploadDialog.View;
});