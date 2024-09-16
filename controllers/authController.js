const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer"); // For sending email
const crypto = require("crypto");

// Helper function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("User lookup complete:", user);

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Stored password hash for user:", user.password);
    let checkPassword = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", checkPassword);

    if (!checkPassword) {
      console.log("Invalid password for email:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("JWT token generated:", token);
    console.log("Login successful for email:", email);
    res.status(200).json({ message: "Login successful", token, role: user.role ,status:200}); 
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Forgot Password request received for email:", email);

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User found:", user.email);

    // Generate and set OTP and expiration
    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = new Date(Date.now() + 3600000);
    
    // Save the updated user document
    await user.save();
    user = await User.findOne({ email: email.toLowerCase() });

    console.log("OTP generated and saved:", otp);
    console.log("OTP saved in database:", user.resetPasswordOTP);
    console.log("OTP expiration saved:", user.resetPasswordOTPExpires);

    // Set up nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USERNAME,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 1 hour.\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);

    console.log("Password reset OTP sent to:", user.email);

    res.status(200).json({ message: "OTP sent to email", status: 200 }); 
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: error.message });
  }
};
// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("Verifying OTP for email:", email, "with OTP:", otp);

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("No user found with email:", email);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User found:", user.email);
    console.log("Stored OTP:", user.resetPasswordOTP);
    console.log("Stored OTP Expiration:", user.resetPasswordOTPExpires);
    console.log("Current Time:", new Date());

    // Check if OTP matches
    if (user.resetPasswordOTP !== otp) {
      console.log("OTP mismatch for email:", email);
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (user.resetPasswordOTPExpires < new Date()) {
      console.log("OTP expired for email:", email);
      return res.status(400).json({ error: "Expired OTP" });
    }

    console.log("OTP valid for user:", user.email);

    res.status(200).json({ message: "OTP verified", status: 200 });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Reset Password (No Token)
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;

    console.log("Reset password request for email:", email);

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("No user found with email:", email);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User found:", user.email);
    console.log("Stored OTP:", user.resetPasswordOTP);
    console.log("Stored OTP Expiration:", user.resetPasswordOTPExpires);
    console.log("Current Time:", new Date());

    // Check if OTP matches
    if (user.resetPasswordOTP !== otp) {
      console.log("OTP mismatch for email:", email);
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (user.resetPasswordOTPExpires < new Date()) {
      console.log("OTP expired for email:", email);
      return res.status(400).json({ error: "Expired OTP" });
    }

    console.log("OTP valid, proceeding to reset password");

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear OTP fields
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined; // Clear the OTP
    user.resetPasswordOTPExpires = undefined; // Clear OTP expiration
    await user.save();

    console.log("Password successfully reset for user:", user.email);

    res.status(200).json({ message: "Password successfully reset", status: 200 });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: error.message });
  }
};

