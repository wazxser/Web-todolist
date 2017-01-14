var express = require('express');
var router = express.Router();

var List = require('../services/lists');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var err;
    var uid = req.query.uid;
    console.log(uid);
    List.findByUserId(uid, function (err,data) {
        if (err) {
            console.log('List.find error!');
        }
        res.json(data);
        console.log(data);
    });
});

router.get('/:list_id', function(req, res, next) {
    var err;
    List.updateStatus(req.params.list_id, function (err,data) {
        if (err) {
            console.log('List.find error!');
        }
        res.json(data);
        console.log(data);
    })
});

router.post('/', function(req, res, next) {
    var err;
    var list = req.body;
    List.add(list, function (err, data) {
        res.json(data);
    });
});

router.delete('/:list_id', function(req, res, next) {
    var err;
    List.delete(req.params.list_id,function (err,data) {
        if (err) {
            console.log('List.delete error!');
        }
        res.json(data);
    });
});

module.exports = router;
