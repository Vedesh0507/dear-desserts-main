require('dotenv').config();
const cloudinary = require('./config/cloudinary');

const test = async () => {
  try {
    console.log("Cloudinary config:", cloudinary.config());
    
    // Create a 1x1 transparent PNG buffer
    const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
    
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'dear_desserts/test' },
      (error, result) => {
        if (error) {
          console.error("Upload error:", error);
        } else {
          console.log("Upload result:", result);
          console.log("Secure URL:", result.secure_url);
        }
      }
    );
    stream.end(buffer);
  } catch (err) {
    console.error(err);
  }
};

test();
