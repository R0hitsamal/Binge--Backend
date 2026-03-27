import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
   
    return {
      folder: "Video-streamming",
      resource_type: file.fieldname === 'thumbnail' ? 'image' : 'video',
    };
  },
});

export default cloudinary;
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // 5GB for videos
  },
});
