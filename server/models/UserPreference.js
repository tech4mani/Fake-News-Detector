import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  topics: [{
    type: String,
  }],
  sources: [{
    type: String,
  }],
  updateFrequency: {
    type: String,
    enum: ['realtime', 'hourly', 'daily', 'weekly'],
    default: 'daily',
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('UserPreference', userPreferenceSchema);