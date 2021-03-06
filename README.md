# JSDbCore

Website: <a href="http://guimeframework.wordpress.com/">Guime Framework</a>

A full client-side javascript database library.

JSDbCore is a library created to simplify the new Html5 javascript asynchronous database API's.<br>
It uses Html5 technologies like IndexedDb and WebSql to implement a easier client-side database API,
enabling web apps to run totally offline.

This is a start, so only the indexeddb api is partially complete.

*This technologies are experimental, so could apper some bugs and the api change with the time.<br>
*Check the browser compatibility before try.

## QuickStart

### Dependencies
JSDbCore needs jquery to work, so include this in your project

```html
	<script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
```
After you can continue with the getting started.

### Getting Started
Before try this examples you need to load the JSDbCore library in your application.
Try this:

````html
	<script type="text/javascript" src="path_to_jsdbcore.js"></script>
````

Replace the path_to_jsdbcore.js for the path to the JSDbCore.js file.

#### Setup your database
##### Some Configurations changed, look the index.html example to configurate your database.
The first thing you have to do is setup your database configuration.
Let's create a database that will be used in the following examples.
This examples use as base a noSQL database, if you want to know more how objects are storaged in this database, 
search for indexedDb and noSQL. 

We will create a database called 'forest', that will store all florest stuffs , like trees, animals, etc.

Inside the database, we criate stores( this is like a 'table' sql, but schemaless and so much flexible ) 
to store witch type of data separeted, like: 

Create a store for the trees and another for the animals.

So, lets code, for now we will just create the trees store:

```js
// this is the configuration object, set this to configure your app
JSDbCore.defaultConfig = {
	
	//the databases array contain a item for each database intance, 
	//so with this you could have more than one database running async.
	databases: [
		{
			name: 'forest', //name of the database
			version: 1,  //version of the database, this is very important, see bellow for better explanation
			
			stores: [ //like databases array, stores has an item for each store in db.
				{
					name: 'trees' // store name
					options: { keyPath: 'id', autoIncrement: true } // some options like the key, see bellow.
				}
			]
		}
	]
}
```

This is a basic configuration. Optionally you can add callbacks like afterOpen and errorOnOpen 
and attributes like overwrite and type(indexeddb default).

#### Version attribute
Why the version is so important?
Because the only way to change the database stores structure is changing his version.
Additionally there is a overwrite flag that verify if the store already exist and take a decision,
true will overwrite, false(default) will mantain the old store.	

#### KeyPath
The keyPath acts like a SQL Primary Key and has to be unique, this will be the key of the record in the database.
Keypath value is an attribute of the record that you will try to store.

Supposing that we will try to store a tree, the 'object' will look like this.
Ex.
```js
	treeObject = {
		name: 'Tree Name', //Lets give this tree a name, you can put every attribute that you want.
		id: 1 // here we set an attribute called id
		
	}
```	

If you see the store configuration, we set the keypath with the value  'id', so when you save this record the Key of the 
record will be the 'id' attribute value, that is '1' in this case.

But if you try to add a new record with the same id value, 
the new record will not be saved because already exist one record with the same key, so we set autoIncrement as true,
and don't set the attribute relationed with the keyPath value, that is the 'id' attribute.

######Atention
If no keyPath is defined in the config, the system will use a keyGenerator, but in this case when we find the record to get
his key to update or delete, the api 'looses' the key value, 
unlike the keyPath way, that the key comes with the object attrbiutes (this is a bug). 

#### Insert example

Inserting a tree in the forest database.

```js
	var modelTree = JSDbCore.Model.New({store: 'trees', database: 'forest'}); //Create a new model
	modelTree.attributes = { name : 'Apple Tree' }; //Set the attributes
	modelTree.save(); //Save in database
```

A three line insert api. Aditionally you can setup a callback like this:

```js
	var modelTree = JSDbCore.Model.New({store: 'trees', database: 'forest'});
	modelTree.attributes = { name : 'Apple Tree' };
	
	modelTree.afterSave = function () { // Set a callback.
		
		alert(modelTree.name + ' Inserted'); // Show an alert for each inserted model
	
	};
	
	modelTree.save();
```

#### Find example

Let's find a record in the database. assuming that the record we are looking for, is an orange tree:
```js
	var modelTree = JSDbCore.Model.New( { store: 'trees', database: 'forest' } ); //Create a new model
	
	//Set a callback afterFind. pass a param with an array of models found.
	modelTree.afterFind = function (treesFound) {

		for(var i in treesFound) 
			alert(treesFound[i].attributes.name + ' Found'); //Show an alert for each model found
	
	};
	
	// Add a condition passing the attribute to search and the value.
	modelTree.dbcriteria.addCondition ( { name: 'Orange Tree' } ); 

	modelTree.findAllByCriteria(); // Find by the criteria conditions.			

```

Simple, isn't ?. Aditionally you have a lot of options like a SQL 'LIKE' statement, inside objects search and others features.

####Delete example
```js
var modelTree = JSDbCore.Model.New( { store: 'trees', database: 'forest' } ); //Create a new model
				
modelTree.key = key; //key of the record
modelTree.delete(); //delete the record
```
## Documentation 

The documentation isn't complete, but a incomplete copy is in the repositories.
To see an example, download and execute the index.html inside example. 

Inside index.html exist a script configuring a database, inserting a record, deleting and using the findAll
and findAllByCriteria methods.

Use this and the getting started pdf as a guide while the official documentation isn't released.

### License
Licensed under the [MIT license](http://en.wikipedia.org/wiki/MIT_License).