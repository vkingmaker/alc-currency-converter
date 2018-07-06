var https = require('https');
var express = require('express');
var router = express.Router();

// router.get('/', function(req, res, next) {
//     console.log(req);
// res.render('currencyConverter');
// });

router.get('/', function(req, res, next) {

   var amount = req.query.amount;
   var from = req.query.from;
   var to = req.query.to;

    function convertCurrency(amount, fromCurrency, toCurrency, cb) {
      var apiKey = 'your-api-key-here';
    
      fromCurrency = encodeURIComponent(fromCurrency);
      toCurrency = encodeURIComponent(toCurrency);
      var query = fromCurrency + '_' + toCurrency;
    
      var url = 'https://free.currencyconverterapi.com/api/v5/convert?q='
                + query + '&compact=ultra';
    
      https.get(url, function(res){
          var body = '';
    
          res.on('data', function(chunk){
              body += chunk;
          });
    
          res.on('end', function(){
              try {
                var jsonObj = JSON.parse(body);
    
                var val = jsonObj[query];
                if (val) {
                  var total = val * amount;
                  cb(null, Math.round(total * 100) / 100);
                } else {
                  var err = new Error("Value not found for " + query);
                  console.log(err);
                  cb(err);
                }
              } catch(e) {
                console.log("Parse error: ", e);
                cb(e);
              }
          });
      }).on('error', function(e){
            console.log("Got an error: ", e);
            cb(e);
      });
    }
    
    // res.render('currencyConverter');

    if(!amount){
    res.render('currencyConverter',{result:''});
    }
    
    if(amount){
    convertCurrency(amount, from, to, function(err, amount) {
     console.log('WE GOT HERE!!!');
     console.log(amount);
      res.json(amount);
    });
}
    
});

module.exports = router;
