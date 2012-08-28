(function (undefined) {
	
	var _guime = window.guime;	

	var GuimeClass = {
		New: function () {
			return new this.Class();
		},
		
		Class: function () {
			this.loadedModules = [];
			this.loadQueue = [];
			
			this.loadModules = function (config) {
				var extPath = "http://localhost/jsdbcore/jscore/ext";
				var modulesPath = {
					"model": {
							src: extPath + '/ModelClass.js',
							className: 'model',
							dependencies: ['db']
						},						
					"db": {
							src: extPath + '/DatabaseClass.js',
							className: 'db'
						},				
					"controller": {
							src: extPath + '/ControllerClass.js',
							className: 'controller',
							dependencies: ['db', 'model', 'view']
						},				
					"view": {
							src: extPath + '/ViewClass.js',
							className: 'view',
							dependencies: ['db', 'model', 'controller']
						}				
				}
				
				for(var i in config.modules) {
					this.loadQueue.push(config.modules[i].name);	
				}

				for(var i in config.modules) {
					var module = config.modules[i];
					var load = modulesPath[module.name];
					var head = document.head;
					
					if(guime.loadedModules.indexOf(module.name) !== -1) {
						continue;	
					}
					
					var scriptElement = document.createElement('script');
					scriptElement.type = 'text/javascript';
					scriptElement.src = load.src;
					scriptElement.id = module.name;
					
					scriptElement.onload = (function (module, load) {
							module.onLoad = module.onLoad ? module.onLoad : function () {};
							var resolveModule =  function () {
								var moduleKey = guime.loadQueue.indexOf(module.name);
									
								//resolve dependencies.
								if(load.dependencies)	{
									
									for(var d in load.dependencies) {
										var dependModule = load.dependencies[d];
										
										//if dependencie is not loaded
										if(guime.loadedModules.indexOf(dependModule) === -1) {
											
											//if the module is not in the queue, load him.
											if(guime.loadQueue.indexOf(dependModule) === -1) {
												guime.loadModules({modules: [{name: dependModule, onLoad: function () {}}]});
											}
											
											var dependOnload = document.getElementById(dependModule).onload;
											var newOnload = (function (dependOnload) {
													
													return function () {
														dependOnload.apply(this, []);	
														resolveModule.apply(this, []);
													}
													
												})(dependOnload);
												
											document.getElementById(dependModule).onload = newOnload;	
											return true;									
										}									
									}	
								}
														
								module.onLoad.apply(guime, [guime[load.className]]);
								guime.loadedModules.push(module.name);
								guime.loadQueue.splice(moduleKey, 1);							
							};
							
							return resolveModule;
							
						})(module, load);
					
					head.appendChild(scriptElement);
	
				}				
			}
			
			this.noConflict = function (newName) {
				
				window[newName] = guime;
				window.guime = _guime;
			
			}
			
		}	
	}
	var guime;
	window.guime = guime = GuimeClass.New();
	
	

})();
