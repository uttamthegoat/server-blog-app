const CustomError = require("../errors/CustomError");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");
const Post = require("../models/Post");
const sharp = require("sharp");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// this route will be used to upload profile images
exports.imageUploadUser = asyncErrorHandler(async (req, res) => {
  const { email } = req.body;
  
  const webpBuffer = await sharp(req.file.buffer).toFormat("webp").toBuffer();

  const fileStr = webpBuffer.toString("base64");
  
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

// this route will be used to upload blog images
exports.imageUploadPost = asyncErrorHandler(async (req, res) => {
  const { id } = req.body;
  
  const webpBuffer = await sharp(req.file.buffer).toFormat("webp").toBuffer();
  
  const fileStr = webpBuffer.toString("base64");

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
    { _id: id },
    { image: url },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Image successfully updated",
    image: updatedDocument.image,
  });
});
