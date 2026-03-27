import { Video } from "../model/video.js";
import cloudinary from "../config/cloudConfig.js";

export const uploadVideo = async (req, res) => {
  try {
    if (!req.files) {
      console.error('ERROR: req.files is undefined');
      return res.status(400).json({ message: "No files received by server" });
    }

    if (!req.files.video || req.files.video.length === 0) {
      console.error('ERROR: No video file in req.files. Available fields:', Object.keys(req.files));
      return res.status(400).json({ message: "No video file uploaded. Please select a video file." });
    }

    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      console.error('ERROR: Missing required fields - title:', title, 'description:', description, 'category:', category);
      return res.status(400).json({
        message: "Title, description and category are required",
      });
    }

    const videoFile = req.files.video[0];
    const videoUrl = videoFile.path;
    const publicId = videoFile.filename;
    // Use custom thumbnail if provided, otherwise generate from video
    let thumbnailUrl = '';
    if (req.files.thumbnail && req.files.thumbnail[0]) {
      thumbnailUrl = req.files.thumbnail[0].path;
    } else {
      // Auto-generate thumbnail from video at 2 seconds
      thumbnailUrl = cloudinary.url(publicId, {
        resource_type: "video",
        format: "jpg",
        transformation: [
          { width: 480, height: 300, crop: "fill" },
          { start_offset: "2" },
        ],
      });
    }

    const duration = videoFile.duration || 0;

    const video = await Video.create({
      title,
      description,
      category,
      videoUrl,
      thumbnailUrl,
      publicId,
      duration,
      uploader: req.user._id,
    });

    res.status(201).json({
      message: "Video uploaded successfully",
      video,
    });
  } catch (err) {
    res.status(500).json({
      message: "Upload failed: " + err.message,
      error: err.message,
    });
  }
};
export const videos = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    // Handle search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Handle category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Build sort object
    let sortObj = { createdAt: -1 }; // default: newest
    if (sort === 'popular') {
      sortObj = { views: -1 };
    } else if (sort === 'liked') {
      sortObj = { likeCount: -1 };
    }

    const allVideos = await Video.find(query)
      .populate('uploader', 'username email')
      .sort(sortObj); 

    res.status(200).json({
      success: true,
      videos: allVideos
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch videos",
      error: err.message,
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const allVideos = await Video.find()
      .populate('uploader', 'username');
    
    const totalViews = allVideos.reduce((sum, v) => sum + (v.views || 0), 0);
    const totalLikes = allVideos.reduce((sum, v) => sum + (v.likeCount || 0), 0);
    const avgViews = allVideos.length ? Math.round(totalViews / allVideos.length) : 0;
    
    // Top 5 videos by views
    const topVideos = [...allVideos]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
    
    // Category breakdown
    const categoryMap = {};
    allVideos.forEach(v => {
      const category = v.category || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });
    
    const categories = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    // Engagement rate
    const engagementRate = totalViews ? ((totalLikes / totalViews) * 100).toFixed(1) : 0;
    
    res.status(200).json({
      success: true,
      analytics: {
        totalVideos: allVideos.length,
        totalViews,
        totalLikes,
        avgViews,
        engagementRate: parseFloat(engagementRate),
        topVideos,
        categories,
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch analytics",
      error: err.message,
    });
  }
};
export const getVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId).populate('uploader', 'username email');

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    video.views += 1;
    await video.save();

    res.status(200).json(video);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch video",
      error: err.message,
    });
  }
};
export const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    if (video.publicId) {
      await cloudinary.uploader.destroy(video.publicId, {
        resource_type: "video",
      });
    }

    await video.deleteOne();

    res.status(200).json({
      message: "Video deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete video",
      error: err.message,
    });
  }
};