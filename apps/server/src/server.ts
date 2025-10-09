import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HEMA Server is running' });
});

app.get('/api/matches', (req, res) => {
  // TODO: Implement match retrieval
  res.json({ matches: [] });
});

app.post('/api/matches', (req, res) => {
  // TODO: Implement match creation
  res.json({ message: 'Match created', id: crypto.randomUUID() });
});

// Start server
app.listen(PORT, () => {
  console.log(`HEMA Server running on port ${PORT}`);
});