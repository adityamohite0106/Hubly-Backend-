const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    index: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    index: true,
  },
  password: {
    type: String,
    required: true, // ✅ No password regex validation here (handled before hashing)
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Hash password before saving (validation is done in `signup` controller)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
   
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  
    next();
  } catch (err) {
    
    next(err);
  }
});


// ✅ Compare passwords for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);