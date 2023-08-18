var jwt = require("jsonwebtoken");

exports.generateToken = (userId, res) => {
  const payload = {
    id: userId,
  };
  const auth_token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  res.cookie("access_token", auth_token, {
    sameSite: "none",    // uncomment it while deployment
    // sameSite: "lax", // comment it while deployment
    path: "/",
    expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true, // uncomment it while deployment
  });
};
