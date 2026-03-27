import express from "express";
import { addToWatchHistory, deleteFromWatchHistory, getWatchHistory  } from "../controller/watchHistory.js";
import { isLogin } from "../middleware/auth.js";
const router = express.Router();

router.get("/watchHistory", isLogin, getWatchHistory);
router.get("/:videoId/addToWatchHistory", isLogin, addToWatchHistory);
router.delete("/:videoId/deleteFromWatchHistory", isLogin, deleteFromWatchHistory);

export default router;
