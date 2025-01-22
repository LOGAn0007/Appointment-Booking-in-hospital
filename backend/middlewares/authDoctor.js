import jwt from "jsonwebtoken";

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    console.log("Token Header:", dtoken);

    if (!dtoken) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, please log in again",
      });
    }

    const decodedToken = jwt.verify(dtoken, process.env.JWT_SECRET);
    console.log("Decoded Token:", decodedToken);

    req.body.docId = decodedToken.id;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res
      .status(401)
      .json({ success: false, message: "Not authorized, please log in again" });
  }
};

export default authDoctor;
