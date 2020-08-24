const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//definir notre model
const postSchema = new Schema({
  title: String,
  categories: [String], // array of trings
  content: String, // html
  authorId: String,
  authorName: String,
  time: Date,
});

// Créer notre model class
const ModelClass = mongoose.model('post', postSchema);

// Export le model
module.exports = ModelClass;