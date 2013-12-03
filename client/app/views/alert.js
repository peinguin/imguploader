define([
	'underscore',
	'backbone',
	'text!app/templates/alert.htt'
], function(_, Backbone, LayoutText){
	var Alert = Backbone.View.extend({

    	el: '#alerts',

	    render: function(text, type, ttl){

	    	if(!ttl){
	    		ttl = 1;
	    	}

	    	if(!type){
	    		type = 'danger';
	    	}
	    	var data = {
	    		text:text,
	    		type: type,
	    		ttl: ttl
	    	};

	    	var compiledTemplate = _.template( LayoutText, data );
	    	if(this.$el.length == 0){
	    		this.$el = $(this.$el.selector);
	    	}
	    	this.$el.html( compiledTemplate );
	    },

	    empty: function(){
	    	if(this.$el.length == 0){
	    		this.$el = $(this.$el.selector);
	    	}
	    	this.$el.children('div').each(function(){
	    		var el = $(this);
	    		if(!el.attr('data-ttl') || el.attr('data-ttl') == 1){
	    			el.remove();
	    		}else{
	    			el.attr('data-ttl', el.attr('data-ttl') - 1);
	    		}
	    	});
	    }
	});
 	return Alert;
});