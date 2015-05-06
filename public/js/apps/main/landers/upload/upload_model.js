/*
This is just a mock dumb ass model used because to do client side validation on the notes
thingy for the upload lander thing.
*/

define(["app"], function(RipManager){
  RipManager.module("LandersApp.Upload.Model", function(Model, RipManager, Backbone, Marionette, $, _){

    Model.Upload = Backbone.Model.extend({
      url: "/edit_notes",
      defaults: {
        notes: ""
      },

      validation: {
        notes: {
          required: true
        }
      }

    });

  });
  return RipManager.LandersApp.Upload.Model;
});