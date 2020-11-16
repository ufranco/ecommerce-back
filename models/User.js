const { Schema, model } = require("mongoose");

const UserSchema = Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Please provide a Username' ],
      maxlength: [
        30, 
        "Username cannot be larger than 30 characters"
      ],
      match: [
        /^[a-zA-Z0-9]+$/, 
        "Please provide a valid username."
      ],
      unique: [true, "Username already taken"],
    },
    email: {
      type: String,
      required: [
        true, 
        "Please provide an email."
      ],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "please enter a valid email",
      ],
      unique: [
        true, 
        "Another account is already using that email."
      ],
    },
    emailConfirmation: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      trim: true,
      minlength: [
        8, 
        'Password must contain at least 8 characters'
      ],
      match:[
        /^.*(?=.*[A-Z].*[A-Z]).*$/, 
        "Password must have at least two uppercase letters."
      ],
      match: [
        /^.*(?=.*[!@#$&*]).*$/, 
        "Password must have at least one special case letter."
      ],
      match: [
        /^.*(?=.*[0-9].*[0-9]).*$/, 
        "Password must have at least two digits."
      ],
      match: [
        /^.*(?=.*[a-z].*[a-z].*[a-z]).*$/, 
        "Password must have at least three lowercase letters."
      ],
    },
    profileName: {
      type: String,
      required: [true, "Please provide a Profile name."],
      trim: true,
      maxlength: [
        20, 
        "Profile name cannot be larger than 30 characters."
      ],
    },
    country:  String,
    sex: {
      type: String,
        enum: [
          "MALE", 
          "FEMALE", 
          "NOT SPECIFIED", 
        ],
        default: "NOT SPECIFIED",
    },
    profilePic: {
      type: String,
      default: "default-profile-pic.jpg",
    },
    userType: {
      type: String,
      enum : [
        'VANILLA',
        'FACEBOOK',
        'GOOGLE',
      ],
      default: 'VANILLA',
    }
  },
  {
    timestamps: { 
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    } 
  }
);

module.exports = model("User", UserSchema);
