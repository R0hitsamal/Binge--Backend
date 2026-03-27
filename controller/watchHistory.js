import { WatchHistory } from "../model/watchHistory.js";

export const addToWatchHistory = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    let history = await WatchHistory.findOne({ userId, videoId });

    if (history) {
      history.watchedAt = Date.now();
      await history.save();
    } else {
      history = await WatchHistory.create({ userId, videoId });
    }

    res.status(200).json({
      success: true,
      message: "Watch history updated",
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating watch history",
      error: error.message,
    });
  }
};
export const getWatchHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const history = await WatchHistory.find({ userId })
      .populate("videoId")
      .sort({ watchedAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching watch history",
      error: error.message,
    });
  }
};

export const deleteFromWatchHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { videoId } = req.params;

    await WatchHistory.findOneAndDelete({ userId, videoId });

    res.status(200).json({
      success: true,
      message: "Video removed from watch history",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting history",
      error: error.message,
    });
  }
};
