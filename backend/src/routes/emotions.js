const express = require("express");
const Emotion = require("../models/Emotions");
const { authenticateToken } = require("./auth");

const router = express.Router();

// Create Emotion API
router.post("/create-emotion", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { emotion, title, leftContent, rightContent } = req.body;

  if (!emotion) {
    return res.status(400).json({ error: "Emotion is required." });
  }

  try {
    const newEmotion = new Emotion({
      emotion,
      leftContent: leftContent || "",
      rightContent: rightContent || "",
      userId: userId,
      title: title
    });

    await newEmotion.save();

    res.status(201).json({ 
      message: "Emotion logged successfully", 
      emotion: {
        id: newEmotion._id,
        emotion: newEmotion.emotion,
        leftContent: newEmotion.leftContent,
        rightContent: newEmotion.rightContent,
        createdAt: newEmotion.createdAt,
        userId: newEmotion.userId,
        title: newEmotion.title
      }
    });
  } catch (error) {
    console.error("Error creating emotion:", error);
    res.status(500).json({ error: "Failed to log emotion." });
  }
});

// Read Emotion by Date Range API
router.post("/read-emotions", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required." });
  }

  try {
    const queryStartDate = new Date(startDate);
    const queryEndDate = new Date(endDate);

    const emotions = await Emotion.find({
      userId: userId,
      createdAt: {
        $gte: queryStartDate,
        $lte: queryEndDate
      }
    }).sort({ createdAt: -1 });

    res.status(200).json({ 
      message: "Emotion retrieved successfully", 
      emotions: emotions 
    });
  } catch (error) {
    console.error("Error retrieving emotions:", error);
    res.status(500).json({ error: "Failed to retrieve emotions." });
  }
});

// Update Emotion API
router.post("/update-emotion", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { emotionId, emotion, leftContent, rightContent, title } = req.body;

  if (!emotionId) {
    return res.status(400).json({ error: "emotionId is required." });
  }

  try {
    const emotionEntry = await Emotion.findOne({
      _id: emotionId,
      userId: userId
    });

    if (!emotionEntry) {
      return res.status(404).json({ error: "Emotion not found or you don't have permission to update it." });
    }
    console.log("Check 1");
    if (emotion !== undefined) {
      emotionEntry.emotion = emotion;
    }
    console.log("Check 2");
    if (leftContent !== undefined) {
      emotionEntry.leftContent = leftContent;
    }
    console.log("Check 3");
    if (rightContent !== undefined) {
      emotionEntry.rightContent = rightContent;
    }
    console.log("Check 4");
    if (title !== undefined) {
      emotionEntry.title = title
    }
    console.log("Check 5");
    await emotionEntry.save();
    console.log("Check 6");
    res.status(200).json({ 
      message: "Emotion updated successfully", 
      emotion: emotionEntry 
    });
  } catch (error) {
    console.error("Error updating emotion:", error);
    res.status(500).json({ error: "Failed to update emotion." });
  }
});

// Delete Emotion API
router.post("/delete-emotion", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { emotionId } = req.body;

  if (!emotionId) {
    return res.status(400).json({ error: "emotionId is required." });
  }

  try {
    const emotion = await Emotion.findOne({
      userId: userId,
      _id: emotionId
    });

    if (!emotion) {
      return res.status(404).json({ error: "Emotion not found or you don't have permission to delete it." });
    }

    await emotion.deleteOne();

    res.status(200).json({ message: "Emotion deleted successfully" });
  } catch (error) {
    console.error("Error deleting emotion:", error);
    res.status(500).json({ error: "Failed to delete emotion." });
  }
});

module.exports = router;
