/**
 * @desc        configure aliases and dependencies
 */

if (typeof DEBUG === 'undefined') DEBUG = true;

require.config({

    baseUrl: '/',

    paths: {
      jquery: 'http://localhost:3000/lib/jquery/dist/jquery',
      underscore: 'http://localhost:3000/lib/underscore-amd/underscore',
      backbone: 'http://localhost:3000/lib/backbone-amd/backbone',
      bootstrap: 'http://localhost:3000/lib/bootstrap/dist/js/bootstrap',
      parsley: 'http://localhost:3000/lib/parsleyjs/dist/parsley',
      text: 'http://localhost:3000/lib/requirejs-text/text'
    },

    // non-AMD lib
    shim: {
      'bootstrap'             : { deps : ['jquery'], exports : 'Bootstrap' },
      'parsley'               : { deps: ['jquery'] }
    }

});

require(['main']);           // Initialize the application with the main application file.