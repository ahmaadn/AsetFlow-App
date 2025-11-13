import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// CONFIGURASI
const CLOUDINARY_ROOT_FOLDER = process.env.CLOUDINARY_ROOT_FOLDER || 'asetflow';

export { CLOUDINARY_ROOT_FOLDER, cloudinary };
export default cloudinary;
