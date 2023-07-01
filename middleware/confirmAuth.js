var jwt = require("jsonwebtoken");
const CustomError = require("../errors/CustomError");

const confirmAuth = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      throw new CustomError(401, false, "Please login first");
    }
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = {
      id: data.id,
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = confirmAuth;