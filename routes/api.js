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
const COLLECTION_NAME = 'stockPriceChecker';
const STOCK_API = 'https://api.iextrading.com/1.0';

let getStockPrice = ticker => {
  return rp(`${STOCK_API}/stock/${ticker}/price`, { json: true })
    .then(body => {
      return body;
    })
    .catch(err => {
      console.log('Stock API Error');
      return err;
    })
}

let addLike = (ticker, ip, collection) => {
  return collection.updateOne({ticker: ticker}
    , {$addToSet: {ipLikes: ip}}
    , {upsert: true});
}

let getLikes = (ticker, collection) => {
  return collection.findOne({ticker: ticker}).then(function(doc) {
    if (!doc) return 0;
    else return doc.ipLikes.length;
  })
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      MongoClient.connect(CONNECTION_STRING, async function (err, db) {
        if (err) console.log('Failed to connect to db' + err);
        else console.log('Connected to DB');
        let collection = db.collection(COLLECTION_NAME);
        // console.log(req.query);
        // console.log(req.ip);
        let ticker = req.query.stock;
        let ip = req.ip;
        let stockData = {};
        let results = [];
        if (Array.isArray(ticker)) {
          let likes = [];
          for (let tick in ticker) {
            let upperTick = ticker[tick].toUpperCase();
            if (req.query.like) await addLike(upperTick, ip, collection);
            likes[tick] = await getLikes(upperTick, collection);
            await getStockPrice(upperTick).then(body => {
              results.push({
                stock: upperTick,
                price: body.toString(),
              })
            })
          }
          // console.log(likes);
          results[0].rel_likes = likes[0] - likes[1];
          results[1].rel_likes = likes[1] - likes[0];
          stockData.stockData = results;
          res.send(stockData);
        } else {
          let upperTick = ticker.toUpperCase()
          if (req.query.like) await addLike(upperTick, ip, collection);
          getStockPrice(upperTick).then(body => {
            getLikes(upperTick, collection).then(likes => {
              // console.log(likes);
              res.send({
                stockData: {
                  stock: upperTick,
                  price: body.toString(),
                  likes: likes
                }
              })
            })
          });
        }
      })
    });

};
