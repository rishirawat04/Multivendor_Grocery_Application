import express from "express";
import { getUserDetails, loginUser, logoutUser, registerUser, updateUserProfile } from "../controllers/auth/authController.js";
const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);
router.post("/logout", logoutUser)

//  protected route
// router.get("/profile", protect, (req, res) => {
//   res.json(req.user);
// });


// get user details 
router.get('/profile/:userId', getUserDetails)

// Route to update user profile
router.put('/:userId/profile', updateUserProfile);

export default router;
