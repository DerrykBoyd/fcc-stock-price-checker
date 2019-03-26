/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
const rp = require('request-promise');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const STOCK_API = 'https://api.iextrading.com/1.0';

let getStockPrice = ticker => {
  return rp(`${STOCK_API}/stock/${ticker}/price`, {json:true})
    .then(body => {
      console.log(`Ticker: ${ticker}, Price: ${body}`);
      return body;
    })
    .catch(err => {
      console.log(err);
      return err;
    })
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      let ticker = req.query.stock;
      getStockPrice(ticker).then(body => {
        res.send({
          stock: ticker,
          price: body.toString(),
          likes: '// TODO'
        })
      });
    });
    
};
