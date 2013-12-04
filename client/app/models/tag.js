define(
	[
		'backbone',
		'app/config'
	],
	function(
		Backbone,
		cfg
	) {
		var ImageModel = Backbone.Model.extend({
			urlRoot: cfg.baseUrl + 'tag.json',
			url: function(){
				if(this.get('id')){
					return this.urlRoot + '/' + this.get('id');
				}else{
					return cfg.baseUrl + 'tags.json' + '/' + this.get('image_id');	
				}
			},
			idAttribute: 'id'
		});

		return ImageModel;
	}
);