const CustomError = require("../errors/CustomError");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");
const Post = require("../models/Post");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// this route will be used to upload profile images and blog images
exports.imageUpload = asyncErrorHandler(async (req, res) => {
  const fileStr = req.file.buffer.toString("base64");

  const transformationOptions = {
    transformation: [
      { gravity: "face", width: 400, height: 400, crop: "thumb" },
    ],
    folder: "Blog_App",
  };

  const result = await cloudinary.uploader.upload(
    `data:image/jpeg;base64,${fileStr}`,
    transformationOptions
  );

  if (!result)
    throw new CustomError(false, 400, "Image not Uploaded! Try Again");
  const url = result.secure_url;
  const { type, email } = req.body;
  const Model = type === "User" ? User : Post;
  const updatedDocument = await Model.findOneAndUpdate(
    { email: email },
    { image: url },
    { new: true }
  );
  res.status(200).json({ image: updatedDocument.image });
});
