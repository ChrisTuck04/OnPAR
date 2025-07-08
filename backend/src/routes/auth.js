const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Events = require("../models/Events");
const Emotions = require("../models/Emotions");
const { randomUUID } = require('crypto');
const sgMail = require('@sendgrid/mail');
require("dotenv").config();

const router = express.Router();

// Email setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Helper function for sending email
const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;

  const message = {
    from: process.env.SENDGRID_SENDER_EMAIL,
    to: email,
    subject: "Verify Your Email for Your Application",
    html: `
      <p>Hello,</p>
      <p>Thank you for choosing OnPAR! Please click the following link to verify your email address:</p>
      <p><a href="${verificationLink}">Verify Email</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not register for this account, please ignore this email.</p>
    `,
  };

  try {
    await sgMail.send(message);
    console.log(`Verification email sent to ${email} via SendGrid`);
  } catch (emailError) {
    console.error(`Error sending verification email to ${email} via SendGrid:`, emailError);
    // SendGrid errors often have a response property with more details
    if (emailError.response) {
      console.error(emailError.response.body);
    }
    throw new Error('Failed to send verification email via SendGrid.');
  }
};

const sendResetEmail = async (email, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`; 

  const message = {
    from: process.env.SENDGRID_SENDER_EMAIL,
    to: email,
    subject: "OnPAR Password Reset Request",
    html: `
      <p>Hello,</p>
      <p>You recently requested to reset your password for your account.</p>
      <p>To reset your password, please click on the following link:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not request a password reset for this account, please ignore this email.</p>
    `,
  };

  try {
    await sgMail.send(message);
    console.log(`Password Reset email sent to ${email} via SendGrid`);
  } catch (emailError) {
    console.error(`Error sending password reset email to ${email} via SendGrid:`, emailError);
    // SendGrid errors often have a response property with more details
    if (emailError.response) {
      console.error(emailError.response.body);
    }
    throw new Error('Failed to send password reset email via SendGrid.');
  }
};

function authenticateToken(req, res, next)
{
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) 
  {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
        console.error("JWT verification error:", err.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
});
}

// Register API
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomUUID();
    const verificationTokenExpires = Date.now() + 1000 * 60 * 60 * 24;

    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash: hashedPassword,
      isVerified: false,
      verificationToken: verificationToken,
      verificationTokenExpires: verificationTokenExpires,
    });

    const savedUser = await newUser.save();
    
    await sendVerificationEmail(savedUser.email, verificationToken);

    res.status(201).json({ message: `User ${savedUser.email} registered successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Email Verification API
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    })

    if(!user)
    {
      return res.redirect(`${process.env.FRONTEND_URL}/verification-failure`);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    return res.redirect(`${process.env.FRONTEND_URL}/verification-success`);
  }
  catch (error)
  {
    console.error("Email verification error:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/verification-failure`);
  }
});

//Resend Verification Email API
router.post("/resend-verification-email", async (req, res) => {
  const { email } = req.body;

  try
  {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if(user.isVerified)
    {
      return res.status(400).json({ message: "Email is already verified." });
    }

    const newVerificationToken = randomUUID();
    const newVerificationTokenExpires = Date.now() + 1000 * 60 * 60 * 24;

    user.verificationToken = newVerificationToken;
    user.verificationTokenExpires = newVerificationTokenExpires;
    await user.save();

    await sendVerificationEmail(user.email, newVerificationToken);

    res.status(200).json({ message: "Verification email re-sent successfully." });
  }
  catch(error)
  {
    console.error("Error re-sending verification email:", error);
    res.status(500).json({ error: "Failed to re-send verification email." });
  }
});

// Login API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    if (!user.isVerified) {
      return res.status(403).json({ error: "Please verify your email before logging in." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
});

// Forgot Password API
router.post("/forgot-password", async (req, res) => {
  const{ email } = req.body;

  try
  {
    const user = await User.findOne({ email });
    if(!user)
    {
      res.status(200).json({ message: "Password Reset Email Sent" });
    }

    const resetToken = randomUUID();
    const resetTokenExpires = Date.now() + 1000 * 60 * 60 * 24;

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    await sendResetEmail(user.email, user.resetToken);

    res.status(200).json({ message: "Password Reset Email Sent"})
  }
  catch(error)
  {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to process password reset request." });
  }
})

// Reset Password API
router.post("/reset-password", async (req, res) => {
  const{token, newPassword} = req.body;

  try
  {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Password reset token is invalid or has expired." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.passwordHash = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Your password has been successfully reset." });
  } 
  catch (error) 
  {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password." });
  }
});

// ===== EVENT API ENDPOINTS =====

// Create Event API
router.post("/create-event", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { title, content, startTime, endTime, recurring, color, recurDays, recurEnd } = req.body;

  try {
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

// ===== EMOTION API ENDPOINTS =====

// Create Emotion API
router.post("/create-emotion", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { emotion, content } = req.body;

  if (!emotion) {
    return res.status(400).json({ error: "Emotion is required." });
  }

  try {
    const newEmotion = new Emotions({
      emotion,
      content: content || "",
      userId: userId
    });

    await newEmotion.save();

    res.status(201).json({ 
      message: "Emotion logged successfully", 
      emotion: {
        id: newEmotion._id,
        emotion: newEmotion.emotion,
        content: newEmotion.content,
        createdAt: newEmotion.createdAt,
        userId: newEmotion.userId
      }
    });
  } catch (error) {
    console.error("Error creating emotion:", error);
    res.status(500).json({ error: "Failed to log emotion." });
  }
});

// Read Emotions by Date Range API
router.post("/read-emotions", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required." });
  }

  try {
    const queryStartDate = new Date(startDate);
    const queryEndDate = new Date(endDate);

    const emotions = await Emotions.find({
      userId: userId,
      createdAt: {
        $gte: queryStartDate,
        $lte: queryEndDate
      }
    }).sort({ createdAt: -1 });

    res.status(200).json({ 
      message: "Emotions retrieved successfully", 
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
  const { emotionId, emotion, content } = req.body;

  if (!emotionId) {
    return res.status(400).json({ error: "emotionId is required." });
  }

  try {
    const emotionEntry = await Emotions.findOne({
      _id: emotionId,
      userId: userId
    });

    if (!emotionEntry) {
      return res.status(404).json({ error: "Emotion not found or you don't have permission to update it." });
    }

    if (emotion !== undefined) {
      emotionEntry.emotion = emotion;
    }
    if (content !== undefined) {
      emotionEntry.content = content;
    }

    await emotionEntry.save();

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
    const emotion = await Emotions.findOne({
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
