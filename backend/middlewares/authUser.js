import jwt from "jsonwebtoken";

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log("Token Header:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, please log in again",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decodedToken);

    req.body.userId = decodedToken.id;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res
      .status(401)
      .json({ success: false, message: "Not authorized, please log in again" });
  }
};

export default authUser;
