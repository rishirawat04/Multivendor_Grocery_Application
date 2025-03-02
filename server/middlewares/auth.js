import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      req.user = user;
      //console.log(req.user);
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


 const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // console.log("Roles allowed:", roles);
    // console.log("User role:", req.user.accountType);

    if (!req.user || !req.user.accountType) {
      return res.status(403).json({ message: "Access denied, user not found or role missing" });
    }

    let role = req.user.accountType.toLowerCase(); // Convert role to lowercase for comparison

    if (!roles.map(role => role.toLowerCase()).includes(role)) { // Ensure roles array is also case-insensitive
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};


export { protect, authorizeRoles };
