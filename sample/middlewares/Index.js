/* ----------------------------------------
|
|	@MIDDLEWARE Index
|
---------------------------------------- */

module.exports = {

	/* ----------------------------------------
	|
	|	When you access http://localhost:9000/
	|	It will automatically execute :
	|
	|	displayHomepage()
	|
	|	according to the route configuration
	|	that we have configured in
	|	
	|	routes/Index.json
	|
	---------------------------------------- */

	displayHomepage: function (req, res, next) {
		res.render('index');
	}

};