import promClient from 'prom-client';
import { Request, Response, NextFunction } from 'express';

// Enable default metrics
promClient.collectDefaultMetrics({
  prefix: 'amafor_gladiators_',
  // timeout: 5000,
});

// HTTP Metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestErrors = new promClient.Counter({
  name: 'http_request_errors_total',
  help: 'Total number of HTTP request errors',
  labelNames: ['method', 'route', 'error_type'],
});

// Database Metrics
const dbQueryDuration = new promClient.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table', 'success'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
});

const dbQueriesTotal = new promClient.Counter({
  name: 'db_queries_total',
  help: 'Total number of database queries',
  labelNames: ['operation', 'table'],
});

const dbErrors = new promClient.Counter({
  name: 'db_errors_total',
  help: 'Total number of database errors',
  labelNames: ['operation', 'table', 'error_type'],
});

// Business Metrics
const userRegistrations = new promClient.Counter({
  name: 'user_registrations_total',
  help: 'Total number of user registrations',
  labelNames: ['user_type'],
});

const activeUsers = new promClient.Gauge({
  name: 'active_users_total',
  help: 'Total number of active users',
  labelNames: ['user_type'],
});

const donationsTotal = new promClient.Counter({
  name: 'donations_total',
  help: 'Total donations received',
  labelNames: ['currency'],
});

const donationAmount = new promClient.Histogram({
  name: 'donation_amount',
  help: 'Distribution of donation amounts',
  labelNames: ['currency'],
  buckets: [1000, 5000, 10000, 50000, 100000, 500000],
});

const adViewsDelivered = new promClient.Counter({
  name: 'ad_views_delivered_total',
  help: 'Total number of ad views delivered',
  labelNames: ['zone', 'campaign_id'],
});

const adRevenue = new promClient.Counter({
  name: 'ad_revenue_total',
  help: 'Total advertising revenue',
  labelNames: ['zone', 'currency'],
});

const patronSubscriptions = new promClient.Gauge({
  name: 'patron_subscriptions_total',
  help: 'Total number of active patron subscriptions',
  labelNames: ['tier'],
});

// System Metrics
const memoryUsage = new promClient.Gauge({
  name: 'process_memory_usage_bytes',
  help: 'Process memory usage in bytes',
  labelNames: ['type'], // heapUsed, heapTotal, rss
});

const cpuUsage = new promClient.Gauge({
  name: 'process_cpu_usage_percent',
  help: 'Process CPU usage percentage',
});

const eventLoopLag = new promClient.Gauge({
  name: 'event_loop_lag_seconds',
  help: 'Event loop lag in seconds',
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections_total',
  help: 'Total number of active database connections',
});

// HTTP Metrics Middleware
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const route = req.route?.path || req.path;

  // Record response finish
  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000;

    httpRequestDuration.observe(
      { method: req.method, route, status_code: res.statusCode },
      duration
    );

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });
  });

  next();
};

// Error Metrics Middleware
export const errorMetricsMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const route = req.route?.path || req.path;

  httpRequestErrors.inc({
    method: req.method,
    route,
    error_type: error.constructor.name,
  });

  next(error);
};

// Database Metrics Helper
export const recordDbMetrics = async <T>(
  operation: string,
  table: string,
  fn: () => Promise<T>
): Promise<T> => {
  const startTime = Date.now();

  try {
    dbQueriesTotal.inc({ operation, table });
    const result = await fn();
    const duration = (Date.now() - startTime) / 1000;

    dbQueryDuration.observe(
      { operation, table, success: 'true' },
      duration
    );

    return result;
  } catch (error: any) {
    const duration = (Date.now() - startTime) / 1000;

    dbQueryDuration.observe(
      { operation, table, success: 'false' },
      duration
    );

    dbErrors.inc({
      operation,
      table,
      error_type: error.constructor.name,
    });

    throw error;
  }
};

// Business Metrics Helpers
export const recordUserRegistration = (userType: string) => {
  userRegistrations.inc({ user_type: userType });
  activeUsers.inc({ user_type: userType });
};

export const recordDonation = (amount: number, currency: string = 'NGN') => {
  donationsTotal.inc({ currency });
  donationAmount.observe({ currency }, amount);
};

export const recordAdView = (zone: string, campaignId: string) => {
  adViewsDelivered.inc({ zone, campaign_id: campaignId });
};

export const recordAdRevenue = (amount: number, zone: string, currency: string = 'NGN') => {
  adRevenue.inc({ zone, currency }, amount);
};

export const recordPatronSubscription = (tier: string, action: 'add' | 'remove' = 'add') => {
  if (action === 'add') {
    patronSubscriptions.inc({ tier });
  } else {
    patronSubscriptions.dec({ tier });
  }
};

// System Metrics Collection
export const collectSystemMetrics = () => {
  // Memory usage
  const memory = process.memoryUsage();
  memoryUsage.set({ type: 'heapUsed' }, memory.heapUsed);
  memoryUsage.set({ type: 'heapTotal' }, memory.heapTotal);
  memoryUsage.set({ type: 'rss' }, memory.rss);

  // CPU usage
  const cpu = process.cpuUsage();
  cpuUsage.set((cpu.user + cpu.system) / 1000000); // Convert to percentage

  // Event loop lag
  const start = process.hrtime();
  setImmediate(() => {
    const diff = process.hrtime(start);
    const lag = diff[0] * 1e9 + diff[1];
    eventLoopLag.set(lag / 1e9); // Convert to seconds
  });
};

// Start system metrics collection
if (process.env.NODE_ENV === 'production') {
  setInterval(collectSystemMetrics, 15000);
}

// Metrics endpoint handler
export const metricsHandler = async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    const metrics = await promClient.register.metrics();
    res.send(metrics);
  } catch (error) {
    res.status(500).send('Error generating metrics');
  }
};

// Register all metrics
export const register = promClient.register;

// Export all metrics
export {
  httpRequestDuration,
  httpRequestsTotal,
  httpRequestErrors,
  dbQueryDuration,
  dbQueriesTotal,
  dbErrors,
  userRegistrations,
  activeUsers,
  donationsTotal,
  donationAmount,
  adViewsDelivered,
  adRevenue,
  patronSubscriptions,
  memoryUsage,
  cpuUsage,
  eventLoopLag,
  activeConnections,
};