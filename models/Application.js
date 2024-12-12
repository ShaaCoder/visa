import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  agentId: { type: String, required: true },
  country: { type: String, required: true },
  type: { type: String, required: true },
  applicantName: { type: String, required: true },
  applicationDate: { type: Date, required: true },
  status: { type: String, required: true },
  amount: { type: Number, required: true },
  steps: [{
    title: { type: String },
    description: { type: String },
    status: { type: String },
    date: { type: Date }
  }],
  documents: [{
    name: { type: String },
    status: { type: String }
  }],
  timeline: [String]  // Array of strings, assuming each step is described with a string.
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
