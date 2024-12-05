import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content']
  },
  image: {
    type: String,
    required: false
  },
  author: {
    type: String,
    required: false
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.models.News || mongoose.model('News', NewsSchema);
