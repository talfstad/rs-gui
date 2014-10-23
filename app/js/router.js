define([
  'jquery',
  'underscore',
  'backbone',
  'js/views/main',
], function($, _, Backbone, MainView) {
  var AppRouter = Backbone.Router.extend({
    routes: {
      '/': 'showMain',
      '*actions': 'defaultAction'
    }
  });

  var initialize = function() {
    var app_router = new AppRouter;
    
    app_router.on('showMain', function() {
      var mainView = new MainView();
      projectListView.render();
    });
    
    app_router.on('defaultAction', function(actions) {
      console.log('No route: ', actions);
    });
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});