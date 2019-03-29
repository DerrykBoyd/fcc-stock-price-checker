/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    this.timeout(5000);
    
    suite('GET /api/stock-prices => stockData object', function() {

      let tempLikes;
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          let stockData = res.body.stockData;
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.isObject(stockData);
          assert.property(stockData, 'stock');
          assert.property(stockData, 'price');
          assert.property(stockData, 'likes');
          assert.isString(stockData.stock);
          assert.isString(stockData.price);
          assert.isNumber(stockData.likes);
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog',
                like: true})
        .end(function(err, res){
          let stockData = res.body.stockData;
          tempLikes = stockData.likes;
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.isObject(stockData);
          assert.property(stockData, 'stock');
          assert.property(stockData, 'price');
          assert.property(stockData, 'likes');
          assert.isString(stockData.stock);
          assert.isString(stockData.price);
          assert.isNumber(stockData.likes);
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog',
                like: true})
        .end(function(err, res){
          let stockData = res.body.stockData;
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.isObject(stockData);
          assert.property(stockData, 'stock');
          assert.property(stockData, 'price');
          assert.property(stockData, 'likes');
          assert.isString(stockData.stock);
          assert.isString(stockData.price);
          assert.isNumber(stockData.likes);
          assert.equal(stockData.likes, tempLikes);
          done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog', 'msft']})
        .end(function(err, res){
          let stockData = res.body.stockData;
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'return body is an Object');
          assert.isArray(stockData, 'stockData is an Array');
          assert.equal(stockData.length, 2, 'Array contains two stocks');
          for (stock in stockData) {
            assert.property(stockData[stock], 'stock');
            assert.property(stockData[stock], 'price');
            assert.property(stockData[stock], 'rel_likes');
            assert.isString(stockData[stock].stock);
            assert.isString(stockData[stock].price);
            assert.isNumber(stockData[stock].rel_likes);
          }
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog', 'msft'], like: true})
        .end(function(err, res){
          let stockData = res.body.stockData;
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'return body is an Object');
          assert.isArray(stockData, 'stockData is an Array');
          assert.equal(stockData.length, 2, 'Array contains two stocks');
          for (stock in stockData) {
            assert.property(stockData[stock], 'stock');
            assert.property(stockData[stock], 'price');
            assert.property(stockData[stock], 'rel_likes');
            assert.isString(stockData[stock].stock);
            assert.isString(stockData[stock].price);
            assert.isNumber(stockData[stock].rel_likes);
          }
          done();
        });
      });
      
    });

});
