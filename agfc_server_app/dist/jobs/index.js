"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobManager = void 0;
// jobs/index.ts - Job Manager
const RssFeedCronJob_1 = require("./RssFeedCronJob");
class JobManager {
    constructor() {
        this.rssFeedJob = new RssFeedCronJob_1.RssFeedCronJob();
    }
    /**
     * Initialize and start all cron jobs
     */
    startAllJobs() {
        console.info('Initializing all cron jobs...');
        // Start RSS feed fetching job
        this.rssFeedJob.startFeedFetchJob();
        console.info('All cron jobs started successfully');
    }
    /**
     * Stop all cron jobs
     */
    stopAllJobs() {
        console.info('Stopping all cron jobs...');
        this.rssFeedJob.stopAllJobs();
        console.info('All cron jobs stopped');
    }
    /**
     * Get status of all jobs
     */
    getJobsStatus() {
        const status = this.rssFeedJob.getJobStatus();
        return status;
    }
}
exports.JobManager = JobManager;
//# sourceMappingURL=index.js.map