import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../utils/mailer.js";
import { createError } from "../utils/error.js";

// Register a new user
export const register = async (req, res, next) => {
  try {
    // Check for duplicate email
    const em = await User.findOne({ email: req.body.email });
    if (em) return res.status(409).send({ message: "User with given email already exists" });

    // Check for duplicate username
    const un = await User.findOne({ username: req.body.username });
    if (un) return res.status(409).send({ message: "Username already taken" });

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Create new user
    const newUser = new User({
      ...req.body,
      password: hash,
      isVerified: false, // Default to false until email is verified
    });

    await newUser.save();

    // Generate email verification token
    const token = jwt.sign({ email: req.body.email }, process.env.JWT, { expiresIn: "1h" });
    const confirmationLink = `http://localhost:7700/auth/confirm/${token}`;

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Confirm Your Email",
      html: `<h3>Click the link below to verify your email:</h3>
            <a href="${confirmationLink}" target="_blank">${confirmationLink}</a>`,
    });

    res.status(200).send("User has been created. Please check your email to verify your account.");
  } catch (err) {
    next(err);
  }
};

// Login an existing user
export const login = async (req, res, next) => {
  try {
    // Find user by username
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    // Check if email is verified
    if (!user.isVerified) return next(createError(400, "Email should be verified"));

    // Check password
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) return next(createError(400, "Password doesn't match"));

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT,
      { expiresIn: "1h" }
    );

    // Exclude password and isAdmin from response
    const { password, isAdmin, ...otherDetails } = user._doc;

    // Set cookie and send response
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
        sameSite: "strict",
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};
// Confirm email verification
export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified. You can now log in!" });
  } catch (error) {
    res.status(500).json({ message: "Invalid or expired token" });
  }
};