# PIPA

> PIPA is a router and middleware extensions for ExpressJS.

### Why PIPA

> The idea of PIPA is about how to create ExpressJS router in an easy-way, readable and the middleware to be re-usable.

### Installation

```bash
$ npm install pipa
```

### How-To

There are two ways in how to use PIPA, `simple-mode` and `advance-mode`.
#### How-To-Simple-Mode
1 - Create your Express app and add PIPA.
```js
var express = require('express')
var app = express()
var Pipa = require('pipa');

// Pipa
// @param   object      Express app
// @param   string      Router folder
// @param   string      Middleware folder

var pipa = new Pipa(app, 'router', 'middleware');
pipa.open();

app.listen(3000);
```
2 - Create a middleware folder
```bash
$ mkdir middleware && cd middlware
```
3 - Create a middleware file: `Index.js`
```bash
$ vi Index.js
```
4 - Add a `showIndex` function to `Index.js`
```js
module.exports = {
    showIndex: function (req, res, next) {
        res.json({ message: 'Hello world PIPA!' });
    }
};
```
5 - Create a router folder in your folder project
```bash
$ mkdir router && cd router
```
6 - Afterward, create a route file: `index.json`
```bash
$ vi Index.json
```
7 - Add a http method, url path and also the middleware name to handle the request
```json
{
    "GET /": "Index.showIndex"
}
```
> Explanation:
> `GET /` means `app.get('/', ...);`, you can also use `POST`, `PUT` and `DELETE` methods.

> Explanation:
> The `Index.showIndex` means that it will execute `showIndex` function 
> in `Index.js` file under the middleware folder that we have created previously.

> Explanation:
> The `Index.json` will automatically translated into `/` (root url path). 
> For example, if you want to create a `/user` url path, you only need to create a `User.json` route file. So all routes inside `User.json` file will be able to be accessed under the `/user` url path, e.g. `GET /:id`, you can access it by `/user/:id`

8 - Now run your application by executing `node app.js` and access `http://localhost:8000/` in your favorite browser.

#### How-To-Advance-Mode

In `advance-mode`, we will try to separate `base url path` and `api url path`. The `router` folder will look like below.
```bash
router/
    |- api/
        |- v1
            |- User.json
            |- History.json
        |- v1.2
            |- User.json
    |- Index.json
    |- User.json
```
> Explanation: According to folder structure above, PIPA will automatically generate several endpoints as below.

`API`
- /api/v1/user
- /api/v1/history
- /api/v1.2/user

`BASE`
- /
- /user

You can also use multiple middleware. For example, you want to get current user profile and need to check whether the request is authorized. The `req.pipa` object will come to rescue :D

In `/api/v1/User.json` router file, please add :
```json
{
    "GET /me": [
        "Auth.ensureAuth",
        "User.getProfile"
    ]
}
```
Create a new middleware file `Auth.js`
```js 
module.exports = {
    ensureAuth: function (req, res, next) {
        // Check whether there's an `access_token` in the request
        if (!req.query.access_token) 
            return res.status(401).json({ code: 401, status: 'error', message: 'You are not authorized' });
        
        // Do some access token checking and pass it to the next middleware
        next({ access_token: req.query.access_token, access_token_status: true });
    }
}
```
Afterward, in `User.js` middleware file, you can get the previous data by accessing the `req.pipa` object
```js 
module.exports = {
    getProfile: function (req, res, next) {
        if (!req.pipa.access_token_status)
            return res.status(500).json({ code: 500, status: 'error', message: 'access_token is not valid.' });
            
        // Get user profile based on `access_token` which you can get from `req.pipa.access_token`
        res.status(200).json({ code: 200, status: 'success', data: { user: { `user object` } });
    }
}
```

### Contact

If you have any questions, feedback, idea or anything, please drop me a message at `madebyais@gmail.com`

### License

  [MIT](LICENSE) Copyright © 2015 Faris
