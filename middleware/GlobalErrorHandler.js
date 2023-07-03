module.exports = (error, req, res, next) => {
  if (error.name === "CastError" && error.path === "_id") {
    error.statusCode = 400;
    error.success = false;
    error.message = "Invalid Post ID";
  }
  return res.status(error.statusCode).json({
    success: error.success,
    message: error.message,
  });
};
