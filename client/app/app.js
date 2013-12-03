define(
    [
        'marionette',

        'text!app/templates/layout.htt',
        'app/views/header',
    ],
    function (
        Marionette,

        LayoutTemplte,
        HeaderView
    ){

        var App = new Marionette.Application();

        App.addRegions({
            mainView : '#mainView'
        });

        var MainLayout = Marionette.Layout.extend({
            template: function(){
                return _.template(LayoutTemplte, {});
            },

            regions: {
                header: "header",
                content: "#content"
            }
        });

        var mainLayout = undefined;
        
        App.addInitializer(function(options){
            mainLayout = new MainLayout;
            App.mainView.show(mainLayout);
            var headerView = new HeaderView();
            headerView.App = App;
            mainLayout.header.show(headerView);

            App.Images.start();
            App.Auth.start();
        });

        App.getMainLayout = function(){
            return mainLayout;
        }

        App.on("initialize:after", function(options){
            Backbone.history.start();
        });

        return App;
    }
);