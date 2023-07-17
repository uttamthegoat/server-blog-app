var jwt = require("jsonwebtoken");
const CustomError = require("../errors/CustomError");

const confirmAuth = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    console.log(req.cookies);
    if (!token) {
      throw new CustomError(
        401,
        false,
        "Login session Expired! Please Login Again"
      );
    }
    res;
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!data) {
      res.clearCookie("access_token", { httpOnly: true, expires: new Date(0) });
      res.status(401).send("Session Expired. Login Again");
    }

    req.user = {
      id: data.id,
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = confirmAuth;
