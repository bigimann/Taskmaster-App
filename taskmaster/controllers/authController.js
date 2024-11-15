const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); //password reset

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "User registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: "Login failed" });
  }
};

//PASSWORD RESET

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    // Create reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: "1h" }
    );

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5000/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Password reset link sent to your email.");
  } catch (error) {
    res.status(500).send("Error in password reset request");
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send("User not found");

    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).send("Password has been reset successfully.");
  } catch (error) {
    res.status(400).send("Invalid or expired token");
  }
};

// TRANSPORTER

const transporter = require("../config/emailConfig"); // Adjust the path as needed

const mailOptions = {
  from: "your_email@example.com", // From address
  to: "recipient@example.com", // This email will show in Mailtrap, not delivered
  subject: "Test Email from Nodemailer with Mailtrap",
  text: "This is a test email sent using Mailtrap with Nodemailer!",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("Error:", error);
  }
  console.log("Email sent:", info.messageId);
});
