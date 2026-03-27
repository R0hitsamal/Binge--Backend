import mongoose, { Types } from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    publicId: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likeCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['Action', 'Drama', 'Comedy', 'Thriller', 'Documentary', 'Sci-Fi', 'Horror', 'Romance', "Sports"],
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export const Video = mongoose.model("Video", videoSchema)