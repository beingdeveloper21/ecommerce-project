// import multer from 'multer'

//  const storage = multer.diskStorage({
//    filename:function(req,file,callback){
//        callback(null,file.originalname)
//    }
//  })
// const upload= multer ({storage})
//  export default upload

import multer from "multer";
import path from "path";
import fs from "fs";

// Explicitly use the correct directory path
const uploadDir = path.resolve("backend", "uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // 'recursive: true' ensures all nested directories are created
}

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Use the correct directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Add a timestamp for uniqueness
  },
});

// Create Multer instance
const upload = multer({ storage });

export default upload;
