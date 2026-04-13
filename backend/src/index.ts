// ============================================
// Entry Point - Express Server
// ============================================
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '8000');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('⚠️  Server khởi động nhưng chưa kết nối được MySQL');
  }

  app.listen(PORT, () => {
    console.log('');
    console.log('===========================================');
    console.log(`🚀 BlockData Backend running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`💊 Health: http://localhost:${PORT}/api/health`);
    console.log('===========================================');
    console.log('');
  });
}

start();
