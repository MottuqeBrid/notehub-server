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

// Middleware to verify refresh token
const refreshTokenMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  try {
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }
    // Verify the access token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // If access token is invalid, check for refresh token
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res
            .status(401)
            .json({ success: false, message: "No refresh token provided" });
        }

        // Verify the refresh token
        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (err, decoded) => {
            if (err) {
              return res
                .status(403)
                .json({ success: false, message: "Invalid refresh token" });
            }
            // Generate a new access token
            const accessToken = jwt.sign(
              { id: decoded.id, role: decoded.role }, // user data from refresh token
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: process.env.JWT_EXPIRY } // or your desired expiry
            );
            req.token = accessToken;

            res.cookie("token", accessToken, {
              httpOnly: true,
              // secure: true, // true in production with HTTPS
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            // Proceed to next middleware/handler
            next();
          }
        );
      }
      // If access token is valid, proceed to next middleware/handler
      req.token = token;
      req.userId = decoded.id;
      next();
    });

    // Get the refresh token from cookies
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signupMiddleware, verifyToken, refreshTokenMiddleware };
