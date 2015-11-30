/* ----------------------------------------
|
|	@MIDDLEWARE Auth
|
---------------------------------------- */

module.exports = {

	/* ----------------------------------------
	|
	|	When you access http://localhost:9000/api/v1/user/me
	|	It will automatically execute 2 middlewares:
	|
	|	1. Middleware filename: middlewares/Auth.js
	|
	|	and it will execute the :
	|	
	| 	ensureAuth() 
	|	
	|	to check whether there's an `access_token` param
	|	in the request or not.
	|
	|	If yes, then please refer to 
	|
	|	2. Middleware filename: middlewares/User.js
	|
	---------------------------------------- */

	ensureAuth: function (req, res, next) {
		if (!req.query.access_token)
			return res.status(401).json({ code: 401, status: 'error', message: 'Not authorized.' });

		var user_data = {
			name: 'Ais',
			age: '27 years old'
		};

		next({ user: user_data });
	}

};