import mongoose from "mongoose";
import { Comment } from "../model/comment.js";

export const NewComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { videoId } = req.params;

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "You are not loggedIn" });
    }

    const newComment = await Comment.create({
      comment,
      videoId,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Comment Created",
      data: newComment,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const DeleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed to delete this comment" });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Comments = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const comments = await Comment.find({ videoId })
      .populate("userId", "username email") 
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};