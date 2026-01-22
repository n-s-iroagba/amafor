export interface JobStatus {
    isRunning: boolean;
    activeTasks: number;
    totalJobs: number;
    lastExecution: string;
    nextExecution: string;
}
export declare class RssFeedCronJob {
    private rssFeedService;
    private isRunning;
    private lastExecution;
    private nextExecution;
    private scheduledTasks;
    constructor();
    /**
     * Starts the RSS feed fetching cron job
     * Runs every 30 minutes
     */
    startFeedFetchJob(): void;
    /**
     * Starts multiple cron jobs with different schedules
     */
    startMultipleJobs(): void;
    /**
     * Execute the feed fetching process
     */
    private executeFeedFetch;
    private getPriorityCategories;
    /**
     * Log job execution results
     */
    private logJobExecution;
    /**
     * Handle job errors
     */
    private handleJobError;
    /**
     * Stop all cron jobs (useful for graceful shutdown)
     */
    stopAllJobs(): void;
    /**
     * ✅ Get job status
     */
    getJobStatus(): JobStatus;
    /**
     * Estimate next execution (based on first scheduled job)
     */
    private estimateNextExecution;
}
//# sourceMappingURL=RssFeedCronJob.d.ts.map