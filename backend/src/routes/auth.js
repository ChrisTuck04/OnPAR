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
  const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;

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

module.exports = router;