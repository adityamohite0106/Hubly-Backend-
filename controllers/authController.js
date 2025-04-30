const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Signup Handler
exports.signup = async (req, res) => {
  try {
  
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({ firstName, lastName, email, password }); // Password will be hashed in model
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.status(201).json({
      token,
      user: {
        email: newUser.email,
        firstName: newUser.firstName
      }
    });

  } catch (err) {
    res.status(500).json({ error: "An error occurred during signup.", details: err.message });
  }
};

// Signin Handler
exports.signin = async (req, res) => {
  try {
  
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: "Email or username and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { firstName: identifier }]
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email
      }
    });

  } catch (err) {
    
    res.status(500).json({ error: "An error occurred during signin. Please try again." });
  }
};