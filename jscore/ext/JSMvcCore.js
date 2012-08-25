(function (undefined) {

	var Controller = {
		New: function (config) {
			return new this.Class(config);
		},

		Class: function (config) {
			
			if(JSCore.Db) {
				JSCore.Db.addDbInstance({
					name: "controller",
					stores: [			
						{
							name: "struct",
							options: {keyPath: "id", autoIncrement: true},	
							index: [
								{attr: name, options: {unique: true}}							
							]						
						}
					],
					
					version: 1,
					afterOpen: config.afterOpen,
					errorOnOpen: config.errorOnOpen
				});
				
				this.redir = function (viewname) {
					var model = JSCore.Db.Model.New({store: 'struct', database: 'controller'});
				
					model.afterFind = function (viewfound) {
						var view = viewfound[0];
						if(view) {
							document.body.innerHTML = view.attributes.html;					
						} else {
							console.log("view not found");
						}					
					};
					
					model.dbcriteria.addCondition({name: viewname});
					model.findByCriteria();	
					}
			}
			else {
				console.log("JCore DB Module is required.")	
			}			
					
		}

	}
	
	var View = {
		New: function () {
			return new this.Class();
		},

		Class: function () {
			
			if(JSCore.Db) {
				
				this.add = function () {
					var model = JSCore.Db.Model.New({store: "struct", database: "controller"});
					
					model.dbcriteria.addCondition({name: this.name});
					
					model.afterFind = function (found) {
						if(found.length === 0) {
							model.attributes = {name: this.name, html: this.html};
							model.save();
						}
						else {
							found.attributes = {name: this.name, html: this.html};
							found.save();	
						}
					}
					
					model.attributes = {name: this.name, html: this.html};
					model.save();
				}				
				
			}
			else {
				console.log("JCore DB Module is required.");	
			}			
					
		}

	}

	var MvcClass = {
		
		New: function () {
			return new this.Class();
		},
		
		Class: function () {
			
			this.init = function (config) {
				this.Controller = Controller.New(config);
				this.View = View;
			}
			window.JSCore.Mvc = this;		
			
		},

	}
	
	var MvcInstance = MvcClass.New();

})();