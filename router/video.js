import express from "express";
import { upload } from "../config/cloudConfig.js";
import { isLogin, isAdmin } from "../middleware/auth.js";
import {
  uploadVideo,
  deleteVideo,
  videos,
  getVideo,
  getAnalytics,
} from "../controller/video.js";
const router = express.Router();

// Debug middleware - log incoming requests
router.post("/uploadVideo", (req, res, next) => {
  console.log('\n[ROUTER] Incoming upload request');
  console.log('[ROUTER] Content-Type:', req.get('content-type'));
  next();
});

router.post(
  "/uploadVideo",
  isLogin,
  isAdmin,
  upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]),
  uploadVideo,
);

router.get("/videos", videos);
router.get("/analytics/overview", isLogin, isAdmin, getAnalytics);
router.get("/:videoId", isLogin, getVideo);
router.delete("/:videoId", isLogin, isAdmin, deleteVideo);

export default router;