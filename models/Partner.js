import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [200, 'Name cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  logo: {
    type: String,
    required: false
  },
  website: {
    type: String,
    required: false
  },
  partnershipType: {
    type: String,
    enum: ['strategic', 'technical', 'community', 'other'],
    default: 'other'
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
