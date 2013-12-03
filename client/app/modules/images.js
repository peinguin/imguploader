define(
	[
		'marionette',
		'app/app',
		'app/views/images/images',
		'app/collections/images',
		'app/models/image',
		'app/views/images/search',
		'app/views/images/upload'
	],
	function (
		Marionette,
		App,
		MainView,
		ImagesCollection,
		ImageModel,
		SearchView,
		UploadView
	) {
		App.module("Images", function(MainModule){

			var ImagesController = Marionette.Controller.extend(new function(){
				return {
					main: function(){
						var mainView = new MainView({collection: new ImagesCollection});
						App.mainView.currentView.content.show(mainView);
					},
					upload: function(id){
						var uploadView = new UploadView({collection: new ImagesCollection});
						App.mainView.currentView.content.show(uploadView);
					},
					search: function(phrase){console.log(phrase)
						var search_filed = App.mainView.currentView.header.currentView.search.$el.find('[type=text]');
						if(search_filed.val() != phrase){
							search_filed.val(phrase);
						}
						var collection = new ImagesCollection();
						collection.search = phrase;
						var mainView = new MainView({collection: collection});
						App.mainView.currentView.content.show(mainView);
					}
				}
			});

			var MainRouter = Backbone.Marionette.AppRouter.extend({
				appRoutes: {
					"images": "main",
					"": "main",
					"upload": "upload",
					"search/:phrase": "search",
					"search": "main",
					"search/": "main"
				},
				controller: new ImagesController
			});

			MainModule.addInitializer(function(){
				new MainRouter;
			});

			this.startWithParent = false;

			MainModule.on("start", function(){
				var searchView = new SearchView;
				App.mainView.currentView.header.currentView.search.show(searchView);
			});
		});

		return App.Images;
	}
);