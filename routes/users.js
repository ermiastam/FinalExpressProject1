var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//manoj

router.post('/saveUser', function (req, res, next) {
    console.log('backend api');
    console.log(req);
    var db = req.db;
    db.collection('User').insert({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            picturename: req.body.picturename,
            phonenumber: req.body.phonenumber,
            postStatus: "",
            evaluation: {"email": req.body.email, "role": "", "comment": "", "rating": ""}
        }, function (err, doc) {
            if (err)throw err;
            res.json({done: "done"});
            return db.close();

        }
    );

});


module.exports = router;
