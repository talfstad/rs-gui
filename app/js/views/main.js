define([
  'jquery',
  'underscore',
  'backbone',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!templates/main.html'
], function($, _, Backbone, mainTemplate) {
  var mainView = Backbone.View.extend({ 
    el: $('#container'),
    render: function() {
      // Using Underscore we can compile our template with data
      var data = {};
      var _mainTemplate = _.template( mainTemplate, data );
      // Append our compiled template to this Views "el"
      this.$el.append(_mainTemplate);
    }
  });
  // Our module now returns our view
  return mainView;
});