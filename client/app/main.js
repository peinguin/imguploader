requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app',
        jquery: 'jquery/jquery-2.0.3.min',
        backbone: 'backbone/backbone-min',
        underscore: 'underscore/underscore-min',
        marionette: 'marionette/backbone.marionette.min',
        config: 'app/config',

        bootstrap: 'bootstrap/js/bootstrap.min',

        text: 'backbone/plugins/text',
        css: 'backbone/plugins/css',
        normalize: 'backbone/plugins/normalize'
    },
    shim: {
    	jquery : {
	    	exports : 'jQuery'
	    },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        marionette : {
	    	deps : ['jquery', 'underscore', 'backbone'],
	    	exports : 'Marionette'
	    }
    }
});

requirejs(['app/app'], function(app){
    'use strict';

    require(
        [
            'bootstrap',
            'app/modules/images',
            'app/modules/auth',
        ],
        function () {
            app.start();
        }
    );
});