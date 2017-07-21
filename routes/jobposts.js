var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

router.get('/searchposts/:email', function (req, res, next) {
    var email = req.params.email;
    var db = req.db;
    var collection = db.bind('post');

    collection.find({ "email": email }).toArray(function (err, jobposts) {
         res.json(jobposts);
    });

});

router.get('/searchposts/postapplicants/:id', function (req, res, next) {
    var id = req.params.id;
    var db = req.db;
    var collection = db.bind('post');

    collection.find({ "_id": ObjectId(id)}, {"applicantsEmail":1, "name":1, "hiredapplicants":1}).toArray(function (err, applicantsemail) {
        if (err)
            console.log(err);

         res.json(applicantsemail);
    });

});

router.post('/searchposts/postapplicants', function(req, res, next) {
    var emails = req.body.emails;
    var db = req.db;
    var collection = db.bind('User');

    collection.find({"email": {$in: emails}}).toArray(function (err, applicants) {
        if (err)
            console.log(err);

         res.json(applicants);
    });
})

router.get('/searchposts/postapplicants/detail/:id', function(req, res, next) {
    var id = req.params.id;
    var db = req.db;
    var collection = db.bind('User');

    collection.find({"_id": ObjectId(id)}).toArray(function (err, applicantDetail) {
        if (err)
            console.log(err);

         res.json(applicantDetail);
    });
})

router.post('/searchposts/postapplicants/hire', function(req, res, next) {
    var postid = req.body.postid;
    var email = req.body.email;
    var db = req.db;
    var collection = db.bind('post');

    collection.update({"_id": ObjectId(postid)}, {$push: {"hiredapplicants": email}, $set: {"postStatus": "hired"}});

})
module.exports = router;