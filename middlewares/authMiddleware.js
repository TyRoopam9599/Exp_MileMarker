import JWT from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = await req.headers["authorization"].split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });
    JWT.verify(token, process.env.JWT, (err, decoded) => {
      if (err) {
        return res.status(403).send({
          message: "Token verification failed",
          success: false,
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    res.status(500).send({
      message: "Internkffghjkghjal Server Error",
      success: false,
    });
  }
};
