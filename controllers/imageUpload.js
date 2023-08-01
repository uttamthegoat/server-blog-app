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
exports.imageUploadUser = asyncErrorHandler(async (req, res) => {
  const { email } = req.body;
  const fileStr = req.file.buffer.toString("base64");

  let transformationOptions = {
    transformation: [
      { gravity: "face", width: 400, height: 400, crop: "thumb" },
    ],
    folder: "Blog_App/Users",
  };

  var result = await cloudinary.uploader.upload(
    `data:image/jpeg;base64,${fileStr}`,
    transformationOptions
  );

  if (!result)
    throw new CustomError(400, false, "Image not Uploaded! Try Again");
  const url = result.secure_url;
  const updatedDocument = await User.findOneAndUpdate(
    { email: email },
    { image: url },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Image successfully updated",
    image: updatedDocument.image,
  });
});

exports.imageUploadPost = asyncErrorHandler(async (req, res) => {
  const { email } = req.body;
  const fileStr = req.file.buffer.toString("base64");

  const transformationOptions = {
    folder: "Blog_App/Posts",
  };

  var result = await cloudinary.uploader.upload(
    `data:image/jpeg;base64,${fileStr}`,
    transformationOptions
  );
  if (!result)
    throw new CustomError(400, false, "Image not Uploaded! Try Again");

  const url = result.secure_url;
  const updatedDocument = await Post.findOneAndUpdate(
    { email: email },
    { image: url },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Image successfully updated",
    image: updatedDocument.image,
  });
});
