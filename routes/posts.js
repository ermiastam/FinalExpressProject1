
var express = require('express');
var ObjectId = require('mongodb').ObjectID;
var router = express.Router();



router.get('/posts/post/:id', function(req, res, next) {

    var id =req.params.id;
    //var id=123;
    var db = req.db;
    var collection = db.bind('post');
    collection.findOne({"_id":ObjectId(id)},{_id:0},
        function(err,data){
            if(err)throw err;
            /*collection.find({"email": "ermias@yahoo.com"},function(err,data){
             if(err)throw err;
             */
            console.log(data);

            res.json(data);
        });
});
router.get('/posts', function(req, res, next) {


    var db = req.db;
    var collection = db.bind('post');
    collection.find({}).toArray(
        function(err,data){
            if(err)throw err;
            /*collection.find({"email": "ermias@yahoo.com"},function(err,data){
             if(err)throw err;
             */
            console.log(data);

            res.json(data);
        });
});
router.get('/posts/byfee/:email', function(req, res, next) {

    var email =req.params.email;


    var applicantemail = {applicantsEmail:{$nin: [email]}};
    var posteremail = {email:{$ne:email}};
    var preferedDate = { preferedDate: {"$gte":new Date().toISOString()}};
    var query={$and:[applicantemail,posteremail,preferedDate]};
    //var id=123;
    var db = req.db;
    var collection = db.bind('post');
    collection.find(query).sort({hourlyFee:-1}).limit(10).toArray(
        function(err,data){
            if(err)throw err;
            /*collection.find({"email": "ermias@yahoo.com"},function(err,data){
             if(err)throw err;
             */
            console.log(data);

            res.json(data);
        });
});
router.get('/posts/jobOwner/:email', function(req, res, next) {

    var email =req.params.email;
    console.log(email);
    //var id=123;
    var db = req.db;
    var collection = db.bind('User');
    collection.find({$and:[{"email":email}]}).toArray(
        function(err,data){
            if(err)throw err;
            /*collection.find({"email": "ermias@yahoo.com"},function(err,data){
             if(err)throw err;
             */
            console.log("hello data"+data.toString());

            res.json(data);
        });
});



router.post('/posts/', function(req, res, next) {

    var  email = req.body.email;
    var coords = [parseFloat(req.body.long),parseFloat(req.body.lat)];


    var mylocation = {
        'location': {
            $near: {
                $geometry: { type: "Point", coordinates: coords},
                $maxDistance: 10000
            }
        }

    };

    var db = req.db;

    var applicantsemail = {applicantsEmail:{$nin: [email]}};
    var posteremail = {email:{$ne:email}}

    var prefereddate = {"preferedDate": {"$gte":new Date().toISOString()}};

    var query={$and:[mylocation,applicantsemail,posteremail,prefereddate]};

    var collection = db.bind('post');
    collection.find(query).limit(10).toArray(

        function(err,data){
            if(err)throw err;
            /*collection.find({"email": "ermias@yahoo.com"},function(err,data){
             if(err)throw err;
             */
            console.log(data);

            res.json(data);
        });
});


router.post('/posts/apply/', function(req, res, next) {
    var  email = req.body.email;
    var id =  req.body.id;
    console.log(email);
    console.log(id);

    var db = req.db;
    var collection = db.bind('post');
    collection.update({"_id":ObjectId(id)},{$push:{'applicantsEmail':email}},
        function(err,data){
            if(err)throw err;
            /*collection.find({"email": "ermias@yahoo.com"},function(err,data){
             if(err)throw err;
             */
            console.log(data);

            res.json(data);
        });
})

router.post('/posts/check/', function(req, res, next) {
    var  email = req.body.email;
    var id = req.body.id;


    var db = req.db;
    var collection = db.bind('post');
    collection.findOne({$and:[{"_id":ObjectId(id)},{applicantsEmail:{$in: [email]}}]},
        function(err,data){
            if(err)throw err;
            /*collection.find({"email": "ermias@yahoo.com"},function(err,data){
             if(err)throw err;
             */
            console.log(data);

            res.json(data);
        });
});

//Nolawe's
router.post('/savePosts', function(req, res, next){
    console.log("output "+ req.body.locations+" req body hiredApp ");

    var db = req.db;
    //var collection = db.get('post');
    db.collection('post').insert({

        email: req.body.email,
        name:req.body.name,
        category:req.body.category,
        description:req.body.description,
        location:{"type":"Point","coordinates":req.body.locations},
        duration:req.body.duration,
        hourlyFee:parseInt(req.body.hourlyFee),
        preferedDate:req.body.preferredDate,
        preferedtime:req.body.preferredTime,
        postStatus:req.body.postStatus,
        hiredapplicants:[],
        applicantsEmail:[]
         //applicantsEmail:[req.body.applicantsEmail]

    }
    , function(err, doc){
        if(err) throw err;
        console.dir(`Success: $(JSON.stringify(doc))`);
        res.json({done:"done"});
        return db.close();
    });


});

router.post('/getposts', function(req, res, next) {
    console.log("req param3 "+req.body.latitude);
    var coords = [parseFloat(req.body.longitude),parseFloat(req.body.latitude)];
    // var email=req.params.email;
    console.log(coords);
    var db = req.db;
    //var collection = db.bind('post');
    db.collection('post').find({$and:[{location:{$near:{$geometry:{type:"Point",coordinates: coords},$maxDistance:10000000000000}}}]}).limit(10).toArray(

        function(err,data){
            //console.log(data);
            if(err)throw err;
            /*collection.find({"email": "ermias@yahoo.com"},function(err,data){
             if(err)throw err;
             */
            // console.log(data);

            res.json(data);
        });
});

router.post('/posts/category/', function(req, res, next) {
    var  email = req.body.email;
    var cat = req.body.category;

    console.log(email+cat);
    var applicantsemail = {applicantsEmail:{$nin: [email]}};
    var posteremail = {email:{$ne:email}}
    var category ={category:cat};
    var prefereddate = {"preferedDate": {"$gte":new Date().toISOString()}};


    var query={$and:[applicantsemail,posteremail,prefereddate,category]};


    var db = req.db;
    var collection = db.bind('post');
    collection.find(query).limit(10).toArray(
        function(err,data){
            if(err)throw err;
            /*collection.find({"email": "ermias@yahoo.com"},function(err,data){
             if(err)throw err;
             */
            console.log(data);

            res.json(data);
        });
});

module.exports = router;