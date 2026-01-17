"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeConnections = exports.eventLoopLag = exports.cpuUsage = exports.memoryUsage = exports.patronSubscriptions = exports.adRevenue = exports.adViewsDelivered = exports.donationAmount = exports.donationsTotal = exports.activeUsers = exports.userRegistrations = exports.dbErrors = exports.dbQueriesTotal = exports.dbQueryDuration = exports.httpRequestErrors = exports.httpRequestsTotal = exports.httpRequestDuration = exports.register = exports.metricsHandler = exports.collectSystemMetrics = exports.recordPatronSubscription = exports.recordAdRevenue = exports.recordAdView = exports.recordDonation = exports.recordUserRegistration = exports.recordDbMetrics = exports.errorMetricsMiddleware = exports.metricsMiddleware = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
// Enable default metrics
prom_client_1.default.collectDefaultMetrics({
    prefix: 'amafor_gladiators_',
    timeout: 5000,
});
// HTTP Metrics
const httpRequestDuration = new prom_client_1.default.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
});
exports.httpRequestDuration = httpRequestDuration;
const httpRequestsTotal = new prom_client_1.default.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});
exports.httpRequestsTotal = httpRequestsTotal;
const httpRequestErrors = new prom_client_1.default.Counter({
    name: 'http_request_errors_total',
    help: 'Total number of HTTP request errors',
    labelNames: ['method', 'route', 'error_type'],
});
exports.httpRequestErrors = httpRequestErrors;
// Database Metrics
const dbQueryDuration = new prom_client_1.default.Histogram({
    name: 'db_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation', 'table', 'success'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
});
exports.dbQueryDuration = dbQueryDuration;
const dbQueriesTotal = new prom_client_1.default.Counter({
    name: 'db_queries_total',
    help: 'Total number of database queries',
    labelNames: ['operation', 'table'],
});
exports.dbQueriesTotal = dbQueriesTotal;
const dbErrors = new prom_client_1.default.Counter({
    name: 'db_errors_total',
    help: 'Total number of database errors',
    labelNames: ['operation', 'table', 'error_type'],
});
exports.dbErrors = dbErrors;
// Business Metrics
const userRegistrations = new prom_client_1.default.Counter({
    name: 'user_registrations_total',
    help: 'Total number of user registrations',
    labelNames: ['user_type'],
});
exports.userRegistrations = userRegistrations;
const activeUsers = new prom_client_1.default.Gauge({
    name: 'active_users_total',
    help: 'Total number of active users',
    labelNames: ['user_type'],
});
exports.activeUsers = activeUsers;
const donationsTotal = new prom_client_1.default.Counter({
    name: 'donations_total',
    help: 'Total donations received',
    labelNames: ['currency'],
});
exports.donationsTotal = donationsTotal;
const donationAmount = new prom_client_1.default.Histogram({
    name: 'donation_amount',
    help: 'Distribution of donation amounts',
    labelNames: ['currency'],
    buckets: [1000, 5000, 10000, 50000, 100000, 500000],
});
exports.donationAmount = donationAmount;
const adViewsDelivered = new prom_client_1.default.Counter({
    name: 'ad_views_delivered_total',
    help: 'Total number of ad views delivered',
    labelNames: ['zone', 'campaign_id'],
});
exports.adViewsDelivered = adViewsDelivered;
const adRevenue = new prom_client_1.default.Counter({
    name: 'ad_revenue_total',
    help: 'Total advertising revenue',
    labelNames: ['zone', 'currency'],
});
exports.adRevenue = adRevenue;
const patronSubscriptions = new prom_client_1.default.Gauge({
    name: 'patron_subscriptions_total',
    help: 'Total number of active patron subscriptions',
    labelNames: ['tier'],
});
exports.patronSubscriptions = patronSubscriptions;
// System Metrics
const memoryUsage = new prom_client_1.default.Gauge({
    name: 'process_memory_usage_bytes',
    help: 'Process memory usage in bytes',
    labelNames: ['type'], // heapUsed, heapTotal, rss
});
exports.memoryUsage = memoryUsage;
const cpuUsage = new prom_client_1.default.Gauge({
    name: 'process_cpu_usage_percent',
    help: 'Process CPU usage percentage',
});
exports.cpuUsage = cpuUsage;
const eventLoopLag = new prom_client_1.default.Gauge({
    name: 'event_loop_lag_seconds',
    help: 'Event loop lag in seconds',
});
exports.eventLoopLag = eventLoopLag;
const activeConnections = new prom_client_1.default.Gauge({
    name: 'active_connections_total',
    help: 'Total number of active database connections',
});
exports.activeConnections = activeConnections;
// HTTP Metrics Middleware
const metricsMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const route = req.route?.path || req.path;
    // Record response finish
    res.on('finish', () => {
        const duration = (Date.now() - startTime) / 1000;
        httpRequestDuration.observe({ method: req.method, route, status_code: res.statusCode }, duration);
        httpRequestsTotal.inc({
            method: req.method,
            route,
            status_code: res.statusCode,
        });
    });
    next();
};
exports.metricsMiddleware = metricsMiddleware;
// Error Metrics Middleware
const errorMetricsMiddleware = (error, req, res, next) => {
    const route = req.route?.path || req.path;
    httpRequestErrors.inc({
        method: req.method,
        route,
        error_type: error.constructor.name,
    });
    next(error);
};
exports.errorMetricsMiddleware = errorMetricsMiddleware;
// Database Metrics Helper
const recordDbMetrics = async (operation, table, fn) => {
    const startTime = Date.now();
    try {
        dbQueriesTotal.inc({ operation, table });
        const result = await fn();
        const duration = (Date.now() - startTime) / 1000;
        dbQueryDuration.observe({ operation, table, success: 'true' }, duration);
        return result;
    }
    catch (error) {
        const duration = (Date.now() - startTime) / 1000;
        dbQueryDuration.observe({ operation, table, success: 'false' }, duration);
        dbErrors.inc({
            operation,
            table,
            error_type: error.constructor.name,
        });
        throw error;
    }
};
exports.recordDbMetrics = recordDbMetrics;
// Business Metrics Helpers
const recordUserRegistration = (userType) => {
    userRegistrations.inc({ user_type: userType });
    activeUsers.inc({ user_type: userType });
};
exports.recordUserRegistration = recordUserRegistration;
const recordDonation = (amount, currency = 'NGN') => {
    donationsTotal.inc({ currency });
    donationAmount.observe({ currency }, amount);
};
exports.recordDonation = recordDonation;
const recordAdView = (zone, campaignId) => {
    adViewsDelivered.inc({ zone, campaign_id: campaignId });
};
exports.recordAdView = recordAdView;
const recordAdRevenue = (amount, zone, currency = 'NGN') => {
    adRevenue.inc({ zone, currency }, amount);
};
exports.recordAdRevenue = recordAdRevenue;
const recordPatronSubscription = (tier, action = 'add') => {
    if (action === 'add') {
        patronSubscriptions.inc({ tier });
    }
    else {
        patronSubscriptions.dec({ tier });
    }
};
exports.recordPatronSubscription = recordPatronSubscription;
// System Metrics Collection
const collectSystemMetrics = () => {
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
exports.collectSystemMetrics = collectSystemMetrics;
// Start system metrics collection
if (process.env.NODE_ENV === 'production') {
    setInterval(exports.collectSystemMetrics, 15000);
}
// Metrics endpoint handler
const metricsHandler = async (req, res) => {
    try {
        res.set('Content-Type', prom_client_1.default.register.contentType);
        const metrics = await prom_client_1.default.register.metrics();
        res.send(metrics);
    }
    catch (error) {
        res.status(500).send('Error generating metrics');
    }
};
exports.metricsHandler = metricsHandler;
// Register all metrics
exports.register = prom_client_1.default.register;
//# sourceMappingURL=metrics.js.map