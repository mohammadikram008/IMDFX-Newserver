
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: false },
});

const User = mongoose.model('IMDFXUSER', userSchema);

module.exports = { User };
