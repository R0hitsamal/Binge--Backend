import express from "express";
import { Login, Profile, Register, GetAllUsers } from "../controller/user.js";
import { isLogin } from "../middleware/auth.js";
const router = express.Router();

router.post("/login", Login);
router.post("/register", Register);
router.get("/profile", isLogin, Profile);
router.get("/all", isLogin, GetAllUsers);

export default router;