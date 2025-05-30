const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupMiddleware = async (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  req.body.password = hashedPassword;
  next();
};

const verifyToken = (req, res, next) => {
  console.log("Verifying token...");
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, error: "Failed to authenticate token" });
    }
    req.userId = decoded.id;

    next();
  });
};

module.exports = { signupMiddleware, verifyToken };
