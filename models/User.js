import mongoose from "mongoose";
import validator from "validator";
import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    minlength: 3,
    maxlenght: 20,
    trim: true,
  },
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    required: [true, "please enter your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minlength: 6,
    select: false,
  },
  lastName: {
    type: String,
    maxlenght: 20,
    trim: true,
    default: "lastName",
  },
  location: {
    type: String,
    trim: true,
    maxlenght: 20,
    default: "my city",
  },
});

UserSchema.pre("save", async function () {
  //only trigger if we're modifying the password else it would result in error
  //can also use this.modifiedPaths()
  if (!this.isModified("password")) return;
  const salt = await bcrpyt.genSalt(10);
  this.password = await bcrpyt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = bcrpyt.compare(candidatePassword, this.password);
  return isMatch;
};

export default mongoose.model("User", UserSchema);
