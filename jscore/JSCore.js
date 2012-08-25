(function (undefined) {
	
	var _JSCore = window.JSCore;	
	
	var JSCoreClass = {
		New: function () {
			return new this.Class();
		},
		
		Class: function () {
		
			this.loadModules = function () {
				var extPath = "http://localhost/jscoredev/jscore/ext";
				var modulesPath = {
					"mvccore": {
							src: extPath + '/JSMvcCore.js',
							className: 'Mvc'	
						},						
					"dbcore": {
							src: extPath + '/JSDbCore.js',
							className: 'Db'	
						}				
				}
				
				for(var i in this.config.modules) {
					var load = modulesPath[this.config.modules[i].name];
					var head = document.head;
					var scriptElement = document.createElement('script');
					
					scriptElement.type = 'text/javascript';
					scriptElement.src = load.src;
					
					scriptElement.onload = (function (i, config) {
							return function () {
								config.modules[i].onLoad.apply(JSCore, [JSCore[load.className]]);
							}
						})(i,this.config);
					
					head.appendChild(scriptElement);
				}				
			}
			
			this.noConflict = function (newName) {
				
				window[newName] = JSCore;
				window.JSCore = _JSCore;
			
			}
			
		}	
	}
	var JSCore;
	window.JSCore = JSCore = JSCoreClass.New();
	
	

})();
