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

// Rolendar GPS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/payloads"
 *    GET: finds all payloads
 *    POST: creates a new payloads
 */

app.get("/payloads", function(req, res) {
});

app.post("/payloads", function(req, res) {
  var newpayload = req.body;
  newpayload.createDate = new Date();

  if (!(req.body.firstName || req.body.lastName)) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  db.collection(PAYLOADS_COLLECTION).insertOne(newpayload, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new payload.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/payloads/:id"
 *    GET: find payloads by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/payloads/:id", function(req, res) {
});

app.put("/payloads/:id", function(req, res) {
});

app.delete("/payloads/:id", function(req, res) {
});