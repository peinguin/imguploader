define(function () {
	var storage = function(){
		var supporting = false;
		try {
	    	supporting = 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {}

		if(!supporting){
			var function_undefined = function () {
				return false;
			}
			this.set = function_undefined;
			this.get = function_undefined;
		}else{
			this.set = function (key, value) {
				return localStorage[key] = value;
			}

			this.get = function (key) {
				return localStorage[key];
			}
		}
	}

	return new storage;
});