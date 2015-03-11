requirejs.config({
  baseUrl: "js",
  paths: {
    backbone: "lib/backbone/backbone",
    "backbone.picky": "lib/backbone.picky/lib/amd/backbone.picky",
    "backbone-validation": "vendor/backbone-validation-amd",
    "backbone.syphon": "lib/backbone.syphon/lib/backbone.syphon",
    "bootstrap-dialog": "vendor/bootstrap-dialog",
    bootstrap: "lib/bootstrap/dist/js/bootstrap.min",
    "bootstrap-notify": "vendor/bootstrap-notify",
    jquery: "lib/jquery/dist/jquery",
    "jquery-ui": "lib/jquery-ui/jquery-ui",
    json2: "lib/json2/json2",
    marionette: "lib/backbone.marionette/lib/backbone.marionette",
    spin: "lib/spin/javascripts/jquery.spin",
    text: "lib/requirejs-text/text",
    tpl: "lib/requirejs-underscore-tpl/underscore-tpl",
    underscore: "lib/underscore/underscore",
    parsley: 'lib/parsleyjs/dist/parsley',
    adminLTEapp: 'vendor/AdminLTE/app',
    adminLTEdash: 'vendor/AdminLTE/dashboard',
    adminLTEdemo: 'vendor/AdminLTE/demo',
    morris: 'vendor/plugins/morris/morris',
    raphael: 'vendor/plugins/raphael/raphael',
    datatables: 'vendor/jquery.dataTables'
  },

  shim: {
    "bootstrap-dialog": {
      deps: ["jquery", "underscore","backbone", "bootstrap"],
      exports: ['BootstrapDialog']
    },
    datatables: {
      deps: ['jquery']
    },
    bootstrap: {
      deps: ['jquery']
    },
    adminLTEapp: {
      deps: ['jquery','jquery-ui', 'bootstrap']
    },
    adminLTEdash: {
      deps: ['jquery','jquery-ui', 'bootstrap']
    },
    adminLTEdemo: {
      deps: ['jquery','jquery-ui', 'bootstrap']
    },
    parsley: {
      deps: ['jquery']
    },
    raphael: {
      exports:'Raphael'
    },
    morris: {
      deps: ['jquery', 'raphael'],
      exports: "Morris"
    },
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ["jquery", "underscore", "json2"],
      exports: "Backbone"
    },
    'backbone-validation': {
      deps: ["jquery", "underscore", "backbone"]
    },
    marionette: {
      deps: ["backbone"],
      exports: "Marionette"
    },
    "jquery-ui": ["jquery"],
    tpl: ["text"]
  }
});

require(["app", "apps/header/header_app"], function(RipManager){
  RipManager.start();
});

