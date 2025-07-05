import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profileImage: {
    type: String,
    default: "", // Default profile image URL
  },
  role: {
    type: String,
    enum: ["main", "sub"],
    default: "user", // Default role is 'user'
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family", // Reference to the Family model
  },
  balance: {
    type: Number,
    default: 0, // Default balance is 0
  }
}, {
  timestamps: true,
});  

//hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Nếu password không đổi, bỏ qua
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//compare password
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
