export declare class JobManager {
    private rssFeedJob;
    constructor();
    /**
     * Initialize and start all cron jobs
     */
    startAllJobs(): void;
    /**
     * Stop all cron jobs
     */
    stopAllJobs(): void;
    /**
     * Get status of all jobs
     */
    getJobsStatus(): import("./RssFeedCronJob").JobStatus;
}
//# sourceMappingURL=index.d.ts.map