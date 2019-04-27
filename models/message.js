var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var messageSchema = new mongoose.Schema({
  sender: {
    type: String
  },
  receiver: {
    type: String
  },
  message: {
    type: String
  }
});
var Message = mongoose.model('Message', messageSchema);
module.exports = Message;
