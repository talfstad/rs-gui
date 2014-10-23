define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var MainModel = Backbone.Model.extend({
    defaults: {
      name: "Harry Potter"
    }
  });
  // Return the model for the module
  return MainModel;
});