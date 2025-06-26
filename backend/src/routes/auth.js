const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { randomUUID } = require('crypto');
const sgMail = require('@sendgrid/mail');
require("dotenv").config();

const router = express.Router();

// Email setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Helper function for sending email
const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`; // Adjust BASE_URL as needed

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
      return res.status(400).json({ error: "Invalid or expired verification token." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    res.status(200).json({message: "Email verified successfully! You can now log in."});
  }
  catch (error)
  {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Failed to verify email." });
  }
})

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

module.exports = router;
