import mongoose from 'mongoose';

// Delete the model if it exists to prevent cached schemas
if (mongoose.models.Team) {
  delete mongoose.models.Team;
}

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  strict: true
});

// Export as a new model instance
export default mongoose.model('Team', TeamSchema);