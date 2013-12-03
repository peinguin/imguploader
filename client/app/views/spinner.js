define(
	['backbone', 'underscore', 'text!app/templates/spinner.htt'],
	function (backbone, _, Template) {
		var SpinnerView = Backbone.View.extend({
		  template: _.template(Template, {}),
		  render: function() {

		  	if(this.hover){
		  		var $hover = this.hover.$el;
		  	}else{
		  		var $hover = $('#mainView');
		  	}

			var offset = $hover.offset();
		  	var params = {
		  		top:offset.top,
		  		left:offset.left,
		  		width:$hover.width(),
		  		height:$hover.height()
		  	}

		  	this.$el = $(Template).css(params).prependTo($hover).show();
		  }
		});
		return SpinnerView;
	}
);