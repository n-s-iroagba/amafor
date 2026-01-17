"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const database_1 = __importDefault(require("@config/database"));
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("./models");
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
// Graceful shutdown handlers
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    server.close(async () => {
        console.log('HTTP server closed');
        try {
            // Close database connections
            await database_1.default.close();
            console.log('Database connection closed');
            console.log('Graceful shutdown completed');
            process.exit(0);
        }
        catch (error) {
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
        await (0, models_1.syncDatabase)(false);
        console.log('Database synchronized');
        // Start server
        server = app_1.default.listen(PORT, () => {
            console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
            console.log(`API endpoint: http://localhost:${PORT}/api/v1`);
        });
    }
    catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};
// Declare server variable
let server;
// Start the server
startServer();
// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    gracefulShutdown('Unhandled Rejection');
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('Uncaught Exception');
});
exports.default = server;
//# sourceMappingURL=index.js.map