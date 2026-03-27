import express from "express";
import { NewComment, DeleteComment, Comments } from "../controller/comment.js";
import { isLogin } from "../middleware/auth.js";
const router = express.Router();

router.post("/:videoId/newComment", isLogin, NewComment);
router.delete("/:videoId/deleteComment/:commentId", isLogin, DeleteComment);
router.get("/:videoId/comments", Comments);

export default router;
