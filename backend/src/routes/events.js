const express = require("express");
const Events = require("../models/Events");
const { authenticateToken } = require("./auth");

const router = express.Router();

// Create Event API
router.post("/create-event", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { title, content, startTime, endTime, recurring, color, recurDays, recurEnd } = req.body;

  try {
    if(recurring !== true)
    {
      const newEvent = new Events({
        title,
        content,
        startTime,
        endTime,
        userId: userId,
        color
      });
  
      await newEvent.save();
  
        res.status(201).json({ message: `Event created successfully for user ${userId}`, event: { title, content, startTime, endTime, userId: userId, color} });
    }
    else
    {
      const newEvent = new Events({
        title,
        content,
        startTime,
        endTime,
        recurring,
        userId: userId,
        color,
        recurDays,
        recurEnd
      });
  
      await newEvent.save();
  
        res.status(201).json({ message: `Event created successfully for user ${userId}`, event: { title, content, startTime, endTime, recurring, userId: userId, color, recurDays, recurEnd} });
    }
    
  } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event." });
  }
});

// Update Event API
router.post("/update-event", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { title, content, startTime, endTime, recurring, color, eventId, recurDays, recurEnd} = req.body;

  try
  {
    const event = await Events.findOne({
      _id: eventId,
      userId: userId
    });

    if(!event)
    {
      return res.status(404).json({ message: "Event not found or you don't have permission to update it." });
    }

    if(title !== undefined)
    {
      event.title = title;
    }
    if(content !== undefined)
    {
      event.content = content;
    }
    if(startTime !== undefined)
    {
      event.startTime = startTime;
    }
    if(endTime !== undefined)
    {
      event.endTime = endTime;
    }
    if(recurring !== undefined)
    {
      event.recurring = recurring;
    }
    if(color !== undefined)
    {
      event.color = color;
    }
    if(recurDays !== undefined)
    {
      event.recurDays = recurDays;
    }
    if(recurEnd !== undefined)
    {
      event.recurEnd = recurEnd;
    }

    await event.save();

    res.status(200).json({ message: "Event updated successfully", event: event });
  }
  catch(error)
  {
    console.error("Error updating event:", error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: "Failed to update event." });
  }
})

// Read Events API
router.post("/read-event", authenticateToken, async (req, res) => {
  userId = req.user.id;
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "startDate and endDate are required in the request body." });
  }

  try
  {
    queryStartDate = new Date(startDate);
    queryEndDate = new Date(endDate);
  }
  catch(error)
  {
    return res.status(400).json({ message: "Could not parse date parameters. Please use valid ISO 8601 format." });
  }

  try
  {
    const events = await Events.find({
      userId: userId,
      $or: [
        {
            startTime: { $gte: queryStartDate, $lt: queryEndDate }
        },
        {
            endTime: { $gt: queryStartDate, $lte: queryEndDate }
        },
        {
            startTime: { $lt: queryStartDate },
            endTime: { $gt: queryEndDate }
        }
      ]
    }).sort({startTime: 1 });

    res.status(200).json({ message: "Events retrieved successfully", events: events });
  }
  catch(error)
  {
    console.error("Error retrieving events by date range:", error);
    res.status(500).json({ error: "Failed to retrieve events." });
  }
});

router.post("/delete-event", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body;

  try
  {
    const event = await Events.findOne({
      userId: userId,
      _id: eventId
    })

    await event.deleteOne();

    res.status(200).json({ message: "Event successfully deleted" });
  }
  catch(error)
  {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event." });
  }
})

module.exports = router;
