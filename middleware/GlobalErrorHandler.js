module.exports = (error, req, res, next) => {
    return res.status(error.statusCode).json({
      success: error.success,
      message: error.message,
    });
  };