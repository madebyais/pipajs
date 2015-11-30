/* ----------------------------------------
|
|	@MIDDLEWARE User
|
---------------------------------------- */

module.exports = {

	/* ----------------------------------------
	|
	|	After checking the `ensureAuth`,
	|	PipaJS will automatically execute the 
	|	next middleware:
	|
	|	getProfile()
	|	
	|	By access the `req.pipa`, you will be
	|	able to retrieve previous data passed
	|	by previous middleware.
	|
	---------------------------------------- */

	getProfile: function (req, res, next) {
		res.status(200).json({ code: 200, status: 'success', data: { user: req.pipa.user } });
	}

};