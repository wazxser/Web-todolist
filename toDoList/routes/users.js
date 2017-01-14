var express = require('express');
var router = express.Router();

var User = require('../services/users');
// var List = require('../services/lists');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var err;

  console.log(req.query);

  if(req.query.username!=null) {
    User.findByUsername(req.query.username, function (err, data) {
      if (err) {
        console.log('User.find error!');
      }
      res.json(data);
      console.log(data);
    })
  }
});

router.post('/', function(req, res, next) {
  var err;
  var user_list = req.body;
  User.add(user_list, function (err, data) {
    res.json(data);
  });
});

module.exports = router;
