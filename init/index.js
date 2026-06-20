// this file whenever executed will initalize the database
// by inserting the sample data defined in data.js into the database


const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.resolveSrv('_mongodb._tcp.cluster0.qqxonbj.mongodb.net', (err, addresses) => {
  console.log(err, addresses);
});

if(process.env.NODE_ENV != "production")
{
    require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
}

const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderLust";
const dbUrl = process.env.ATLAS_DB_URL;
//=======================================================
main().then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});

async function main()
{
    await mongoose.connect(dbUrl);
}

//===========================================
console.log("NODE_ENV =", process.env.NODE_ENV);
console.log("ATLASDB_URL =", process.env.ATLAS_DB_URL);
//here we first clean the database by removinf any data if present in database..
// and then will newly initalize db by inserting sample data into it
const initDB=async()=>{
    await Listing.deleteMany({}); //delete existing data present in db
    initdata.data=initdata.data.map((obj)=>({ ...obj, owner:"6a30e14e139764a60cdd47f8"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initliazed and inserted in database");
};

initDB();