/* ------------------------------------------------------------------------
| 	PIPA.JS
---------------------------------------------------------------------------
|
|	Copyright 2015-2016. Faris.
|	http://madebyais.com
|	http://github.com/~madebyais
|
------------------------------------------------------------------------- */

'use strict';

var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var path = require('path');

function Pipa (app, route, middleware) {
	this.app = app;
	this.route = route;
	this.middleware = middleware;
	this.middlewares = {};
}

Pipa.prototype = {

	/******************************************************************
	|	Description: Init router and middleware.
	******************************************************************/

	open: function () {
		this.__init__router();
	},

	/******************************************************************
	|	Description: Router initialization.
	******************************************************************/

	__init__router: function () {
		var self = this;
		var routes;

		this.getRouteFromDirectory(this.routeBasePath(), function (err, dataRoute) {
			if (err) return console.dir(err);

			routes = dataRoute.routes;

			if (dataRoute.dirs && dataRoute.dirs.length > 0) {
				var listRouteFromDir = [];

				dataRoute.dirs.forEach(function (dir) {
					if (dir) listRouteFromDir.push(function (cb) { self.getRouteFromDirectory(self.routeBasePath() + '/' + dir, dir, cb); });
				});

				async.parallel(listRouteFromDir, function (err, asyncData){
					if (err) return console.dir(err);

					listRouteFromDir = [];

					if (asyncData.length > 0) {
						asyncData.forEach(function (data) {
							data.dirs.forEach(function (dir) {
								if (dir)
									listRouteFromDir.push(function (cb) {
										self.getRouteFromDirectory(data.pathDir + '/' + dir, data.rootApiPath + '/' + dir, cb);
									});
							});
						});

						async.parallel(listRouteFromDir, function (err, asyncDataVer){
							if (err) return console.dir(err);

							self.setTempRoutes(asyncData, routes);
							self.setTempRoutes(asyncDataVer, routes);
							self.__init__middleware(routes);
						});
					}
				});
			} else {
				self.__init__middleware(routes);
			}
		});
	},

	/******************************************************************
	|	Description: Middelware initialization.
	******************************************************************/

	__init__middleware: function (routes) {
		var self = this;

		fs.readdirSync(this.middlewareBasePath()).filter(function (file) {
			var middlewareName = file.replace(/\.js$/, '').replace(/\.coffee$/, '');
			self.middlewares[middlewareName] = require(path.join(self.middlewareBasePath(), middlewareName));
		});

		for (var root in routes) {
			if (root && routes[root]) {
				for(var key in routes[root]) {
					var method = key.trim().split(' ')[0].toLowerCase();
					var routerMiddelware = routes[root][key];
					var endpoint;

					if (root == 'index') endpoint = ((key.trim().split(' ')[1].toLowerCase() != '/') ? key.trim().split(' ')[1].toLowerCase() : '/');
					else endpoint = '/' + root + ((key.trim().split(' ')[1].toLowerCase() != '/') ? key.trim().split(' ')[1].toLowerCase() : '');

					self.__endpoint__handler(method, endpoint, routerMiddelware);
				}
			}
		}
	},

	/******************************************************************
	|	Description: Endpoint handler
	******************************************************************/

	__endpoint__handler: function (method, endpoint, routerMiddelware) {
		var self = this;

		if (typeof routerMiddelware == 'object'){
			this.app[method](endpoint, function (req, res, next) {
				var middlewareFunction = []
				routerMiddelware.forEach(function (m) {
					middlewareFunction.push(function (cb) {
						self.__exec__middlewares(m, req, res, cb);
					});
				});

				async.waterfall(middlewareFunction);
			});
		} else {
			this.app[method](endpoint, function (req, res, next) {
				self.__exec__middleware(routerMiddelware)(req, res, next);
			});
		}
	},

	/******************************************************************
	|	Description: Execute single middleware
	******************************************************************/

	__exec__middleware: function (routerMiddelware) {
		var middlewareFilename = routerMiddelware.split('.')[0];
		var middlewareFunction = routerMiddelware.split('.')[1];

		return this.middlewares[middlewareFilename][middlewareFunction];
	},

	/******************************************************************
	|	Description: Execute multiple middleware
	******************************************************************/

	__exec__middlewares: function (routerMiddelware, req, res, next) {
		var middlewareFilename = routerMiddelware.split('.')[0];
		var middlewareFunction = routerMiddelware.split('.')[1];

		if (!req.pipa) req.pipa = {};

		this.middlewares[middlewareFilename][middlewareFunction](req, res, function (data) {
			_.extend(req.pipa, data); next();
		});
	},

	/******************************************************************
	|	Description: Get base path of the router folder
	******************************************************************/

	routeBasePath: function () {
		return process.cwd() + '/' + this.route;
	},

	/******************************************************************
	|	Description: Get first-level of the router folder
	******************************************************************/

	routeFilePath: function (file) {
		return this.routeBasePath() + '/' + file;
	},

	/******************************************************************
	|	Description: Get base path of the middleware folder
	******************************************************************/

	middlewareBasePath: function () {
		return process.cwd() + '/' + this.middleware;
	},

	/******************************************************************
	|	Description: Get all router from a directory
	******************************************************************/

	getRouteFromDirectory: function (path, dir, cb) {
		var self = this;

		if (!cb) {
			cb = dir;
			dir = null;
		}

		fs.readdir(path, function (err, files) {
			if (err) return cb(err);

			var dirs = [];
			var routes = {};

			files.forEach(function (file) {

				var fullPath = dir ? path.join(pathDir, file) : self.routeFilePath(file);
				var fileStat = fs.statSync(fullPath);

				if (fileStat.isFile() && fullPath.match(/\.json$/)) {
					delete require.cache[fullPath];
					routes[file.replace(/\.json$/, '').toLowerCase()] = require(fullPath);
				}

				if (fileStat.isFile() && fullPath.match(/\.js$/)) {
					delete require.cache[fullPath];
					routes[file.replace(/\.js$/, '').toLowerCase()] = require(fullPath);
				}

				if (fileStat.isDirectory()) {
					dirs.push(file);
				}

			});

			cb(null, { dirs: dirs, routes: routes, pathDir: path, rootApiPath: dir });
		});
	},

	/******************************************************************
	|	Description: Get all router from a directory
	******************************************************************/

	setTempRoutes: function (data, routes) {
		var tempRoutes = {};

		data.forEach(function (r) {
			if (r && r.routes) {
				for (var key in r.routes) {
					if (key && r.routes[key] && !routes[r.rootApiPath + '/' + key])
						routes[r.rootApiPath + '/' + key] = r.routes[key]
				}
			}
		});
	}
};

module.exports = Pipa;
