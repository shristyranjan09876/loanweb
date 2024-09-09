const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer"); // For sending email
const crypto = require("crypto");
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for email:", email);

    const user = await User.findOne({ email: email.toLowerCase() });
   
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    let data = req.body
    let Encryptpassword = await bcrypt.hashSync(data.password, 10);
    console.log("password+++++++++++++++++++++++++++++", Encryptpassword);
    let checkPassword = await bcrypt.compare(data.password, password);
    console.log("compare password ++++++++++++++++++++++=", checkPassword);
    console.log("User found:", user.email);
    console.log("Stored password hash:", user.password);

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Login successful for user:", email);
    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ error: error.message });
  }
};




exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Password Reset",
      text: `You are receiving this email because you (or someone else) requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
        `${resetUrl}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "An error occurred while sending the reset link." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "Invalid token or user not found" });
    }

    
    if (Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ error: "Password reset token has expired" });
    }

    
    const hashedPassword = bcrypt.hashSync(newPassword, 10); 

    
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; 
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
