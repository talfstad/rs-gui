define([
  'underscore',
  'backbone',
  // Pull in the Model module from above
  'models/main'
], function(_, Backbone, MainModel) {
  var ProjectCollection = Backbone.Collection.extend({
    model: MainModel
  });
  // You don't usually return a collection instantiated
  return ProjectCollection;
});