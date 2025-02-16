import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // Public
  api_key: process.env.CLOUDINARY_API_KEY, // Private
  api_secret: process.env.CLOUDINARY_API_SECRET, // Private
});

export const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    throw error;
  }
};
