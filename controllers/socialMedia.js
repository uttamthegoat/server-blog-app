const CustomError = require("../errors/CustomError");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const SocialMedia = require("../models/SocialMedia");

// add social media
exports.createSocialMedia = asyncErrorHandler(async (req, res) => {
  const { instagram, facebook, twitter, linkedin } = req.body;
  let socialMedia = await SocialMedia.findOne({ user: req.user.id }).select(
    "instagram facebook twitter linkedin"
  );
  if (!socialMedia)
    throw new CustomError(404, false, "Social Media Information not found");

  if (instagram) socialMedia.instagram = instagram;
  if (facebook) socialMedia.facebook = facebook;
  if (twitter) socialMedia.twitter = twitter;
  if (linkedin) socialMedia.linkedin = linkedin;

  await socialMedia.save();
  res
    .status(200)
    .json({ success: true, message: "Social Media successfully uploaded" });
});

// get all social media
exports.getSocialMedia = asyncErrorHandler(async (req, res) => {
  const socialMedia = await SocialMedia.findOne({ user: req.user.id }).select(
    "instagram facebook twitter linkedin"
  );
  if (!socialMedia)
    throw new CustomError(404, false, "Social Media Information not found");
  res.status(200).json({ success: true, socialMedia });
});

// check customError
