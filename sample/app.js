// Import node modules
var express = require('express');
var app = express();
var ejs = require('ais-ejs-mate'); // Custom EJS mate
var Pipa = require('..');

// Express application config
app.engine('.html', ejs());
app.set('views', './views');
app.set('view engine', 'html');
app.use('/static', express.static('public'));

// Initialize Pipa
var pipa = new Pipa(app, 'routes', 'middlewares');

// Open the Pipa
pipa.open();


/* ----------------------------------------
|
|	@Available routes:
|
|	GET - http://localhost:9000/ => This route will render a page
|	GET - http://localhost:9000/api/v1/user/me?access_token=1 => This route will return a JSON data
|
---------------------------------------- */

app.listen(9000);
console.log('Application listen to port: ' + 9000);