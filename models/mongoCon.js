// const mongoose = require('mongoose');
const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://default:njb123@cluster0.hchg3.mongodb.net/Sih?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const dbName = "Sih";

client.connect((err, client) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected correctly to server");

    const db = client.db(dbName);

    createValidated(db, () => {
      client.close();
    });
  }
});

function createValidated(db, callback) {
  db.createCollection(
    "njb",
    {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["tripName", "image", "date"],
          properties: {
            tripName: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            image: {
              bsonType: "string",
              description:
                "must be a string and base64 of image and is required",
            },
            date: {
              bsonType: "date",
              description: "date of entry",
            },
          },
        },
      },
    },
    function (err, results) {
      console.log("Collection created.");
      callback();
    }
  );
}

// module.exports = mongoose.model('trip',TripSchema);
module.exports = client;
