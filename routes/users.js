var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/hello', function(req, res, next) {
  // res.send('respond with a resource');
  res.json([{
    id: 1,
    username: "shit"

  }, {
    id: 2,
    username: "piss"
  }])
});

module.exports = router;
