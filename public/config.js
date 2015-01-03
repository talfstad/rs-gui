/**
 * @desc        configure aliases and dependencies
 */

if (typeof DEBUG === 'undefined') DEBUG = true;

require.config({

    baseUrl: '/clickjacker/admin/',

    paths: {
      jquery: 'admin/lib/jquery/dist/jquery',
      underscore: 'admin/lib/underscore-amd/underscore',
      backbone: 'admin/lib/backbone-amd/backbone',
      bootstrap: 'admin/lib/bootstrap/dist/js/bootstrap',
      parsley: 'admin/lib/parsleyjs/dist/parsley',
      text: 'admin/lib/requirejs-text/text'
    },

    // non-AMD lib
    shim: {
      'bootstrap'             : { deps : ['jquery'], exports : 'Bootstrap' },
      'parsley'               : { deps: ['jquery'] }
    }

});

require(['main']);           // Initialize the application with the main application file.