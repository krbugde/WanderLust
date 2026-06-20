const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");



//here we pass all the clodinary details which are required to connect our backend to cloudinary account
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.API_SECRET
});


//here we say where we want to store our  files on  our cloudinary account
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png","jpg","jpeg"]
  },
});


//these exported things will be used in routes>listings.js...where we try to create listings by uploading image
module.exports={
    cloudinary,
    storage
}