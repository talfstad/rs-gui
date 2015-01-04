/**
 * @desc        configure aliases and dependencies
 */

if (typeof DEBUG === 'undefined') DEBUG = true;

require.config({

    //baseUrl: '/clickjacker/admin/',
    baseUrl: '/',

    paths: {
      jquery: 'lib/jquery/dist/jquery',
      jqueryEasing: 'js/base/jquery.easing',
      jqueryui: '//code.jquery.com/ui/1.11.1/jquery-ui.min',
      underscore: 'lib/underscore-amd/underscore',
      backbone: 'lib/backbone-amd/backbone',
      bootstrap: 'lib/bootstrap/dist/js/bootstrap',
      parsley: 'lib/parsleyjs/dist/parsley',
      text: 'lib/requirejs-text/text',
      sparkline: 'js/plugins/sparkline/jquery.sparkline.min',
      vectormap: 'js/plugins/jvectormap/jquery-jvectormap-1.2.2.min',
      vectormapworld: 'js/plugins/jvectormap/jquery-jvectormap-world-mill-en',
      knobchart: 'js/plugins/jqueryKnob/jquery.knob',
      daterangepicker: 'js/plugins/daterangepicker/daterangepicker',
      datepicker: 'js/plugins/datepicker/bootstrap-datepicker',
      wysihtml5: 'js/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min',
      icheck: 'js/plugins/iCheck/icheck.min',
      slimscroll: 'js/plugins/slimScroll/jquery.slimscroll.min',
      eve: 'js/plugins/eve',
    },

    // non-AMD lib
    shim: {
      'bootstrap'             : { deps : ['jquery'], exports : 'Bootstrap' },
      'parsley'               : { deps: ['jquery'] },
      'jqueryEasing'          : { deps: ['jquery'] },
      'eve'                   : { exports: "eve" },
      'jqueryui'              : { deps: ['jquery'], exports: "$" },
      // 'raphael'               : { deps: ['eve'], exports: "Raphael" },
      'sparkline'             : { deps: ['jquery'] },
      'vectormap'             : { deps: ['jquery'] },
      'vectormapworld'        : { deps: ['jquery'] },
      'knobchart'             : { deps: ['jquery'] },
      'slimscroll'            : { deps: ['jquery'] },
      'daterangepicker'       : { deps: ['jquery'] },
      'datepicker'            : { deps: ['jquery'] },
      'wysihtml5'             : { deps: ['jquery'] },
      'icheck'                : { deps: ['jquery'] },
    }

});

require(['main']);           // Initialize the application with the main application file.
