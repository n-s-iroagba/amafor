import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
// Accept both the bare domain and the www subdomain in production
const allowedOrigins: (string | RegExp)[] = process.env.NODE_ENV === 'development'
  ? [process.env.DEV_CLIENT_URL || 'http://localhost:3000']
  : [
    process.env.PROD_CLIENT_URL || '',           // e.g. https://amaforgaladiatorsfc.com
    process.env.PROD_CLIENT_WWW_URL || '',        // e.g. https://www.amaforgaladiatorsfc.com
  ].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
    }
  },
  credentials: true,
}));

// Request parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mount all API routes under /api/v1
app.use('/api', apiRoutes);



// Global error handler (should be after all routes)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('--- GLOBAL ERROR HANDLER CAUGHT AN ERROR ---');
  console.error(err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.stack })
  });
});

export default app;