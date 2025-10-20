import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "benin_agro/imports",
    resource_type: "raw", // Pour accepter .xlsx et .csv
    format: async (req, file) => path.extname(file.originalname).slice(1),
  },
});

export const upload = multer({ storage });
export default cloudinary;
