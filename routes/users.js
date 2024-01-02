const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb+srv://vipin018:wepindb@cluster0.1zu0c4n.mongodb.net/?retryWrites=true&w=majority")
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,

  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  dp: {
    type: String  // Assuming storing URL to the profile picture
  },

  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
  }
});

userSchema.plugin(plm);
module.exports = mongoose.model('User', userSchema);
