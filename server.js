// Import dependencies
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { nanoid } from 'nanoid';
import Application from './models/Application.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({
  origin: 'https://viasfrontend.vercel.app/', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the methods you need
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers
  credentials: true, // If you need credentials (cookies or headers)
}));

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// CRUD APIs

// Create a new application
app.post('/applications', async (req, res) => {
  const { userId, agentId, country, type, applicantName, applicationDate, status, amount, steps, documents, timeline } = req.body;
  try {
    const newApplication = new Application({
      userId,
      agentId,
      country,
      type,
      applicantName,
      applicationDate,
      status,
      amount,
      steps,
      documents,
      timeline,
    });
    await newApplication.save();
    res.status(201).json({ message: 'Application created successfully', applicationId: newApplication._id });
  } catch (err) {
    res.status(500).json({ error: 'Error creating application', message: err.message });
  }
});

// Get all applications
app.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching applications', message: err.message });
  }
});

// Get a single application by ID
app.get('/applications/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching application', message: err.message });
  }
});

// Update an application by ID
app.put('/applications/:id', async (req, res) => {
  const { id } = req.params;
  const { status, agentId, steps, documents } = req.body;
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status, agentId, steps, documents },
      { new: true }
    );
    if (!updatedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json({ message: 'Application updated successfully', application: updatedApplication });
  } catch (err) {
    res.status(500).json({ error: 'Error updating application', message: err.message });
  }
});

// Delete an application by ID
app.delete('/applications/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedApplication = await Application.findByIdAndDelete(id);
    if (!deletedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting application', message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
