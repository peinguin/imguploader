define(
	[
		'marionette',
		'app/app',
		'app/views/images/images',
		'app/collections/images',
		'app/models/image',
		'app/views/images/image_full',
		'app/views/images/image_not_found',
		'app/views/spinner',
		'app/views/images/search',
		'app/models/tag',
	],
	function (
		Marionette,
		App,
		MainView,
		ImagesCollection,
		ImageModel,
		ImageFullView,
		ImageNotFoundView,
		SpinnerView,
		SearchView,
		TagModel
	) {
		App.module("Images", function(MainModule){

			var ImagesController = Marionette.Controller.extend(new function(){
				return {
					main: function(){
						App.mainView.currentView.header.currentView.setHeader('Images');

						var imagesCollection = new ImagesCollection;

						var spinnerView = new SpinnerView();
						spinnerView.render();
						imagesCollection.fetch({
							error: function(){
								console.log('error');
							},
							success: function(collection){
								var mainView = new MainView;
								mainView.collection = imagesCollection;
								App.mainView.currentView.content.show(mainView);
								spinnerView.remove();
							}
						})
					},
					image: function(id){
						var conferenceModel = new ConferenceModel;
						conferenceModel.set('id', id);
						conferenceModel.fetch({
							error: function(){
								var conferenceNotFoundView = new ConferenceNotFoundView;
								App.mainView.currentView.content.show(conferenceNotFoundView);
							},
							success: function(conference){
								var conferenceFullView = new ConferenceFullView;
								conferenceFullView.model = conference;
								App.mainView.currentView.content.show(conferenceFullView);
							}
						});
					}
				}
			});

			var MainRouter = Backbone.Marionette.AppRouter.extend({
				appRoutes: {
					"image/:id": "image",
					"images": "main",
					"": "main"
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