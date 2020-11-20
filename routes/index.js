var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("HELLO");
  res.send(__dirname.slice(0 , __dirname.length - 6));;
});

router.get('/js/loader.js', (req, res, next) => {
  res.send('/public/js/loader.js'/*, {root: __dirname.slice(0 , __dirname.length - 6)}*/ );;
});


module.exports = router;
