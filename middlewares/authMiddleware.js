import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers["Authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    jwt.verify(token, process.env.JWT, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: `Token verification failed ${err}`,
          success: false,
        });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({
      message: `Internal Server Error ${error}`,
      success: false,
    });
  }
};
