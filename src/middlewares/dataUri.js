// import DataUriParser from "datauri/parser.js";
// import path from "path";

// const getBuffer = (file) => {
//   const parser = new DataUriParser();
//   const extName = path.extname(file.originalname).toString();

//   return parser.format(extName, file.buffer);
// };

// export default getBuffer;

import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (fileBuffer, folder = "car-images") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "avif"],
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

