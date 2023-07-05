module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.success = error.success || false;
  error.message = error.message || "Internal Server Error";

  if (error.name === "CastError" && error.path === "_id") {
    error.statusCode = error.statusCode || 500;
    error.success = error.success || false;
    error.message = "Invalid Post ID";
  }
  return res.status(error.statusCode).json({
    success: error.success,
    message: error.message,
  });
};
