require.config({
  paths: {
    jquery: 'bower_components/jquery/jquery',
    underscore: 'bower_components/underscore-amd/underscore',
    backbone: 'bower_components/backbone-amd/backbone',
    text: 'bower_components/requirejs-text/text'
  }
});

require(['app'], function(App) {
  App.initialize();
});