var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var PAYLOADS_COLLECTION = "payloads";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());


var db;


mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/payloads"
 *    GET: finds all payloads
 *    POST: creates a new payload
 */

app.get("/payloads", function(req, res) {
  db.collection(PAYLOADS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get payloads.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/payloads", function(req, res) {
  var newpayload = req.body;
  newpayload.createDate = new Date();
  
  db.collection(PAYLOADS_COLLECTION).insertOne(newpayload, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new payload.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});


/*  "/payloads/:id"
 *    GET: find payload by id
 *    PUT: update payload by id
 *    DELETE: deletes payload by id
 */

app.get("/payloads/user/:userid", function(req, res) {
  db.collection(PAYLOADS_COLLECTION).find({userid:req.params.userid}).toArray(function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get payload");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/payloads/user/:userid", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc.userid;

  db.collection(PAYLOADS_COLLECTION).updateOne({userid: req.params.id}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update payload");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/payloads/user/:userid", function(req, res) {
  db.collection(PAYLOADS_COLLECTION).deleteOne({userid: req.params.id}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete payload");
    } else {
      res.status(204).end();
    }
  });
});
