import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    required: true
  }
});

const Article = mongoose.model('Article', articleSchema);

export default Article;