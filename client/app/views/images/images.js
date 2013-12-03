define(
	[
		'marionette',
		'text!app/templates/images/image.htt',
		'app/collections/images',
		'app/views/spinner'
	],
	function (
		Marionette,
		ImageTemplate,
		ImagesCollection,
		SpinnerView
	) {
		var ImageView = Marionette.ItemView.extend({
			template: function(model){
				return _.template(ImageTemplate, model);
			},
			onRender: function () {
				var view = this;

		    	view.$el = view.$el.children();
		    	view.setElement(view.$el);
		    }
		});

		var ImagesView = Marionette.CollectionView.extend({
			search: undefined,
			itemView: ImageView,
			page: 0,
			collection: undefined,
			onRender:function(){
				var view = this;
				view.check_need_mode_images();
			},
		    onClose: function(){
		    	$(window).off('scroll');
		    },
		    check_need_mode_images: function(){
		    	var view = this;
		    	$(window).off('scroll');
				if ($(window).scrollTop() == ($(document).height() - $(window).height())) {

					var spinnerView = new SpinnerView();
					spinnerView.render();

					var tmpCollection = new ImagesCollection;

					var data = {page:++view.page};
					if(view.collection.search){
						data.search = view.collection.search;
					}

					tmpCollection.fetch({
						data:data,
						success: function(){
							if(tmpCollection.length == 0){
								return view.page--;
							}
							tmpCollection.each(function(model){
								view.collection.add(model);
								view.render();
							});
							spinnerView.remove();

							view.check_need_mode_images();
						},
						error: function(){
							console.log('error');
						}
					});
				}else{
					$(window).scroll(function(){view.check_need_mode_images();});
				}
			}
		});

		return ImagesView;
	}
);