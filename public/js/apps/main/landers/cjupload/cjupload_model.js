/*
This is just a mock dumb ass model used because to do client side validation on the notes
thingy for the upload CJ lander
*/

define(["app"], function(RipManager){
  RipManager.module("LandersApp.CJUpload.Model", function(Model, RipManager, Backbone, Marionette, $, _){

    Model.Upload = Backbone.Model.extend({
      url: "/edit_notes",
      defaults: {
        notes: ""
      },

      validation: {
        notes: {
          required: false
        }
      }

    });

  });
  return RipManager.LandersApp.CJUpload.Model;
});