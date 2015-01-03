/**
 * @desc        configure aliases and dependencies
 */

if (typeof DEBUG === 'undefined') DEBUG = true;

require.config({

    //baseUrl: '/clickjacker/admin/',
    baseUrl: '/',

    paths: {
      jquery: 'lib/jquery/dist/jquery',
      underscore: 'lib/underscore-amd/underscore',
      backbone: 'lib/backbone-amd/backbone',
      bootstrap: 'lib/bootstrap/dist/js/bootstrap',
      parsley: 'lib/parsleyjs/dist/parsley',
      text: 'lib/requirejs-text/text'
    },

    // non-AMD lib
    shim: {
      'bootstrap'             : { deps : ['jquery'], exports : 'Bootstrap' },
      'parsley'               : { deps: ['jquery'] }
    }

});

require(['main']);           // Initialize the application with the main application file.