
const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI || 'mongodb+srv://kelly233:22DKvNH2ZxAjH5Z2@cluster4test.wx6yfhl.mongodb.net/task_db?retryWrites=true&w=majority';
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db)
      {
        _db = db.db("tasks");
        console.log("Successfully connected to MongoDB."); 
      }
      return callback(err);
         });
  },

  getDb: function () {
    return _db;
  },
};
