var express = require('express')
  , request = require('./support/http')
  , engine = require('../')
  , ejs = require('ejs')

var app = express();
app.set('views',[__dirname + '/fixtures', __dirname + '/fixtures/thing']);
app.engine('ejs', engine);

// this is not the default behavior, but you can set this
// if you want to load `layout.ejs` as the default layout
// (this was the default in Express 2.0 so it's handy for
// quick ports and upgrades)
app.locals._layoutFile = true;

app.get('/views-array',function(req,res,next){
  res.render('index.ejs',{_layoutFile:false})
})

app.get('/views-array-thing',function(req,res,next){
  res.render('views-array.ejs')
})

describe('app with views array',function(){

  describe('GET /views-array', function(){
    it('should render index.ejs from /fixtures',function(done){
      request(app)
        .get('/views-array')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<h1>Index</h1>');
          done();
        })
    })
  })

  describe('GET /views-array-thing', function(){
    it('should render views-array.ejs from /fixtures/thing',function(done){
      request(app)
        .get('/views-array-thing')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>ejs-locals</title></head><body><h1>Views Array</h1></body></html>');
          done();
        })
    })
  })

})