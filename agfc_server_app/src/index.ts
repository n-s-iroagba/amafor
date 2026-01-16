// server.ts
import sequelize from '@config/database';
import app from './app';
import dotenv from 'dotenv';
import { syncDatabase } from './models';



// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Graceful shutdown handlers
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    try {
      // Close database connections
      await sequelize.close();
      console.log('Database connection closed');
      
      console.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Initialize database and start server
const startServer = async () => {
  try {
  
    await syncDatabase(true)
    console.log('Database synchronized');
    
    // Start server
    server = app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API endpoint: http://localhost:${PORT}/api/v1`);
    });
    
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Declare server variable
let server: any;

// Start the server
startServer();

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  console.error('Unhandled Rejection:', reason);
  gracefulShutdown('Unhandled Rejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('Uncaught Exception');
});

export default server;