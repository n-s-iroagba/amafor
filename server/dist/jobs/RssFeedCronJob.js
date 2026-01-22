"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RssFeedCronJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const RssFeedFetcherService_1 = require("../services/RssFeedFetcherService");
const RssFeedSource_1 = require("../models/RssFeedSource");
class RssFeedCronJob {
    constructor() {
        this.isRunning = false;
        this.lastExecution = null;
        this.nextExecution = null;
        this.scheduledTasks = [];
        this.rssFeedService = new RssFeedFetcherService_1.RssFeedFetcherService();
    }
    /**
     * Starts the RSS feed fetching cron job
     * Runs every 30 minutes
     */
    startFeedFetchJob() {
        console.info('Starting RSS Feed fetching cron job...');
        const task = node_cron_1.default.schedule('0 */30 * * * *', async () => {
            this.lastExecution = new Date();
            await this.executeFeedFetch();
        }, { timezone: 'UTC' });
        this.scheduledTasks.push(task);
        console.info('RSS Feed cron job scheduled successfully (every 30 minutes)');
    }
    /**
     * Starts multiple cron jobs with different schedules
     */
    startMultipleJobs() {
        // High priority feeds - every 15 minutes
        const high = node_cron_1.default.schedule('0 */15 * * * *', async () => {
            this.lastExecution = new Date();
            await this.executeFeedFetch('high');
        });
        // Normal priority feeds - every hour
        const normal = node_cron_1.default.schedule('0 0 * * * *', async () => {
            this.lastExecution = new Date();
            await this.executeFeedFetch('normal');
        });
        // Low priority feeds - every 6 hours
        const low = node_cron_1.default.schedule('0 0 */6 * * *', async () => {
            this.lastExecution = new Date();
            await this.executeFeedFetch('low');
        });
        this.scheduledTasks.push(high, normal, low);
        console.info('Multiple RSS Feed cron jobs started successfully');
    }
    /**
     * Execute the feed fetching process
     */
    async executeFeedFetch(priority) {
        if (this.isRunning) {
            console.warn('⚠️ RSS Feed fetch job is already running, skipping...');
            return;
        }
        this.isRunning = true;
        const startTime = new Date();
        try {
            console.info(`🚀 Starting RSS feed fetch job at ${startTime.toISOString()}${priority ? ` for "${priority}" priority` : ''}`);
            // Get all categories from the enum
            let categories = Object.values(RssFeedSource_1.RssFeedSourceCategory);
            // Filter categories based on priority if specified
            if (priority) {
                const priorityCategories = this.getPriorityCategories(priority);
                categories = categories.filter(cat => priorityCategories.includes(cat));
                console.log(`🎯 Filtered to priority categories:`, categories);
            }
            // Execute all feed fetches in parallel with error handling per category
            const fetchPromises = categories.map(async (category) => {
                try {
                    return await this.rssFeedService.fetchFeeds(category);
                }
                catch (error) {
                    console.error(`❌ Failed to fetch ${category} feeds:`, error);
                    return { success: 0, errors: 1, error: error.message };
                }
            });
            const results = await Promise.all(fetchPromises);
            // Create a results map for better logging
            const resultsMap = categories.reduce((acc, category, index) => {
                acc[category] = results[index];
                return acc;
            }, {});
            const endTime = new Date();
            const duration = endTime.getTime() - startTime.getTime();
            this.lastExecution = endTime;
            // Calculate totals
            const totalSuccess = results.reduce((sum, result) => sum + (result.success || 0), 0);
            const totalErrors = results.reduce((sum, result) => sum + (result.errors || 0), 0);
            console.info('✅ RSS Feed fetch job completed:', {
                categories: categories.length,
                categoriesProcessed: categories,
                results: resultsMap,
                totals: {
                    success: totalSuccess,
                    errors: totalErrors,
                    successRate: totalSuccess > 0 ? ((totalSuccess / (totalSuccess + totalErrors)) * 100).toFixed(2) + '%' : '0%'
                },
                duration: `${duration}ms`,
                finishedAt: endTime.toISOString(),
            });
        }
        catch (error) {
            console.error('❌ RSS Feed fetch job failed:', error);
            await this.handleJobError(error, priority);
        }
        finally {
            this.isRunning = false;
        }
    }
    // Helper method for priority-based filtering
    getPriorityCategories(priority) {
        const priorityMap = {
            'high': [RssFeedSource_1.RssFeedSourceCategory.GENERAL, RssFeedSource_1.RssFeedSourceCategory.SPORTS],
            'medium': [RssFeedSource_1.RssFeedSourceCategory.BUSINESS, RssFeedSource_1.RssFeedSourceCategory.ENTERTAINMENT],
            'low': [RssFeedSource_1.RssFeedSourceCategory.NIGERIA],
            'breaking': [RssFeedSource_1.RssFeedSourceCategory.GENERAL],
            'sports-only': [RssFeedSource_1.RssFeedSourceCategory.SPORTS],
            'business-only': [RssFeedSource_1.RssFeedSourceCategory.BUSINESS],
        };
        return priorityMap[priority] || Object.values(RssFeedSource_1.RssFeedSourceCategory);
    }
    /**
     * Log job execution results
     */
    async logJobExecution(result, duration, priority) {
        try {
            console.info('Job execution logged:', {
                type: 'rss_feed_fetch',
                priority: priority || 'all',
                success_count: result.success,
                error_count: result.errors,
                duration_ms: duration,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Failed to log job execution:', error);
        }
    }
    /**
     * Handle job errors
     */
    async handleJobError(error, priority) {
        console.error('RSS Feed job error handler:', {
            error: error.message,
            stack: error.stack,
            priority: priority || 'all',
            timestamp: new Date().toISOString(),
        });
    }
    /**
     * Stop all cron jobs (useful for graceful shutdown)
     */
    stopAllJobs() {
        this.scheduledTasks.forEach((task) => task.stop());
        console.info('All RSS Feed cron jobs stopped');
    }
    /**
     * ✅ Get job status
     */
    getJobStatus() {
        const activeTasks = this.scheduledTasks.filter((task) => task.getStatus() === 'scheduled').length;
        const totalJobs = this.scheduledTasks.length;
        return {
            isRunning: this.isRunning,
            activeTasks,
            totalJobs,
            lastExecution: this.lastExecution ? this.lastExecution.toISOString() : 'N/A',
            nextExecution: this.estimateNextExecution(),
        };
    }
    /**
     * Estimate next execution (based on first scheduled job)
     */
    estimateNextExecution() {
        if (!this.scheduledTasks.length)
            return 'No scheduled jobs';
        const now = new Date();
        const next = new Date(now.getTime() + 30 * 60 * 1000); // rough estimate
        return next.toISOString();
    }
}
exports.RssFeedCronJob = RssFeedCronJob;
//# sourceMappingURL=RssFeedCronJob.js.map