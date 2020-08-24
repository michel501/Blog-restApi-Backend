const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//definir notre model
const commentSchema = new Schema({
  postId: String,
  content: String, // html
  authorId: String,
  authorName: String,
  time: Date,
});

// Créer notre model class
const ModelClass = mongoose.model('comment', commentSchema);

// Export le model
module.exports = ModelClass;