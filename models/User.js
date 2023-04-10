const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { 
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password:{
    type: String
  },
  avatar: {
    type:String,
    default:"/img/avatar.png"
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
    aboutMe:{
      type: String,
      maxLength: 300,
      default: ""
    },
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe"
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  liked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe"
  }],
  featured: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe"
  }
});

// Password salting
UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for password validation

UserSchema.methods.comparePassword = function comparePassword(candidatePassword,cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => { cb(err, isMatch)})
};

module.exports = mongoose.model("User", UserSchema);