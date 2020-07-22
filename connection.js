//const mysql = require("mysql");
const { Client } = require("pg");
// function connectDatabase() {
//   const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "njb_tracking_system",
//   });

//   connection.connect((err) => {
//     if (err) {
//       console.log(err);
//     } else console.log("Connected to the database!");
//   });
//   return connection;
// }

function connectDatabase() {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      "postgres://tcvlwrbteszvyb:99021849cea2cef6e4bf44fb6bd2c40f3034468d3c4f85ece5f846a8ab630ed9@ec2-52-202-66-191.compute-1.amazonaws.com:5432/dbuvgfb8rkusf5",
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try {
    client.connect();
  } catch (error) {
    console.log("connection to heroku pg failed");
  }

  return client;
}
module.exports = connectDatabase();
