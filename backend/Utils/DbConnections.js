const mongoose = require("mongoose");
require("dotenv").config();
async function Dbconnect() {
   await mongoose.connect(`${process.env.mongo_url}`)
      .then(() => {
         console.log("db connected");
      }).catch((e) => {
         console.log(e);
      });
}

module.exports = Dbconnect;