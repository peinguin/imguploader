define(
	[
		'marionette',
		'text!app/templates/images/upload.htt',
		'jQuery-File-Upload-9.5.0/js/jquery.iframe-transport',
		'jQuery-File-Upload-9.5.0/js/jquery.fileupload',
		'app/models/image',
		'app/config',
		'app/views/images/image.js',
		'app/collections/images'
	],
	function (
		Marionette,
		UploadTemplate,
		undefined,
		undefined,
		ImageModel,
		cfg,
		ImageView,
		ImagesCollection
	) {

		var ImageView = Marionette.CompositeView.extend({
			template: function(model){
				return _.template(UploadTemplate, model);
			},
			onRender: function () {

				var view = this;

		    	view.$el.find('#fileupload').fileupload({
		    		url: cfg.baseUrl + 'images.json',
			        dataType: 'json',
			        done: function (e, data) {
			        	var imageModel = new ImageModel(data.result);
			        	view.collection.add(imageModel);
			        },
			        progressall: function (e, data) {
				        var progress = parseInt(data.loaded / data.total * 100, 10);
				        $('#progress .bar').css(
				            'width',
				            progress + '%'
				        );
				    },
			        add: function (e, data) {
			            data.context = view.$el.find('.status').text('Uploading...').appendTo(view.$el);
			            data.submit();
			        }
			    });
		    },
		    itemViewContainer: ".images",
		    itemView: ImageView
		});

		return ImageView;
	}
);