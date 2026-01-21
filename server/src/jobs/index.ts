// jobs/index.ts - Job Manager
import { RssFeedCronJob } from './RssFeedCronJob';

export class JobManager {
  private rssFeedJob: RssFeedCronJob;

  constructor() {
    this.rssFeedJob = new RssFeedCronJob();
  }

  /**
   * Initialize and start all cron jobs
   */
  public startAllJobs(): void {
    console.info('Initializing all cron jobs...');
    
    // Start RSS feed fetching job
    this.rssFeedJob.startFeedFetchJob();
    
    console.info('All cron jobs started successfully');
  }

  /**
   * Stop all cron jobs
   */
  public stopAllJobs(): void {
    console.info('Stopping all cron jobs...');
    this.rssFeedJob.stopAllJobs();
    console.info('All cron jobs stopped');
  }

  /**
   * Get status of all jobs
   */
  public getJobsStatus() {
    const status =this.rssFeedJob.getJobStatus()
    return status

  }
}