import mongoose from 'mongoose';

const InitiativeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  image: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: false
  },
  goals: [{
    type: String
  }],
  slug: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Initiative || mongoose.model('Initiative', InitiativeSchema);
