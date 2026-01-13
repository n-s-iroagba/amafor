import cron, { ScheduledTask } from 'node-cron';
import { RssFeedFetcherService } from '../services/RssFeedFetcherService';
import { RssFeedSourceCategory } from '../models/RssFeedSource';

export interface JobStatus {
  isRunning: boolean;
  activeTasks: number;
  totalJobs: number;
  lastExecution: string;
  nextExecution: string;
}

export class RssFeedCronJob {
  private rssFeedService: RssFeedFetcherService;
  private isRunning: boolean = false;
  private lastExecution: Date | null = null;
  private nextExecution: Date | null = null;
  private scheduledTasks: ScheduledTask[] = [];

  constructor() {
    this.rssFeedService = new RssFeedFetcherService();
  }

  /**
   * Starts the RSS feed fetching cron job
   * Runs every 30 minutes
   */
  public startFeedFetchJob(): void {
    console.info('Starting RSS Feed fetching cron job...');

    const task = cron.schedule(
      '0 */30 * * * *',
      async () => {
        this.lastExecution = new Date();
        await this.executeFeedFetch();
      },
      { timezone: 'UTC' }
    );

    this.scheduledTasks.push(task);
    console.info('RSS Feed cron job scheduled successfully (every 30 minutes)');
  }

  /**
   * Starts multiple cron jobs with different schedules
   */
  public startMultipleJobs(): void {
    // High priority feeds - every 15 minutes
    const high = cron.schedule('0 */15 * * * *', async () => {
      this.lastExecution = new Date();
      await this.executeFeedFetch('high');
    });

    // Normal priority feeds - every hour
    const normal = cron.schedule('0 0 * * * *', async () => {
      this.lastExecution = new Date();
      await this.executeFeedFetch('normal');
    });

    // Low priority feeds - every 6 hours
    const low = cron.schedule('0 0 */6 * * *', async () => {
      this.lastExecution = new Date();
      await this.executeFeedFetch('low');
    });

    this.scheduledTasks.push(high, normal, low);

    console.info('Multiple RSS Feed cron jobs started successfully');
  }

  /**
   * Execute the feed fetching process
   */
private async executeFeedFetch(priority?: string): Promise<void> {
  if (this.isRunning) {
    console.warn('⚠️ RSS Feed fetch job is already running, skipping...');
    return;
  }

  this.isRunning = true;
  const startTime = new Date();

  try {
    console.info(
      `🚀 Starting RSS feed fetch job at ${startTime.toISOString()}${priority ? ` for "${priority}" priority` : ''}`
    );

    // Get all categories from the enum
    let categories = Object.values(RssFeedSourceCategory);
    
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
      } catch (error:any) {
        console.error(`❌ Failed to fetch ${category} feeds:`, error);
        return { success: 0, errors: 1, error: error.message };
      }
    });

    const results = await Promise.all(fetchPromises);
    
    // Create a results map for better logging
    const resultsMap = categories.reduce((acc, category, index) => {
      acc[category] = results[index];
      return acc;
    }, {} as Record<RssFeedSourceCategory, any>);

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

  
  } catch (error) {
    console.error('❌ RSS Feed fetch job failed:', error);
    await this.handleJobError(error, priority);
  } finally {
    this.isRunning = false;
  }
}

// Helper method for priority-based filtering
private getPriorityCategories(priority: string): RssFeedSourceCategory[] {
  const priorityMap: Record<string, RssFeedSourceCategory[]> = {
    'high': [RssFeedSourceCategory.GENERAL, RssFeedSourceCategory.SPORTS],
    'medium': [RssFeedSourceCategory.BUSINESS, RssFeedSourceCategory.ENTERTAINMENT],
    'low': [RssFeedSourceCategory.NIGERIA],
    'breaking': [RssFeedSourceCategory.GENERAL],
    'sports-only': [RssFeedSourceCategory.SPORTS],
    'business-only': [RssFeedSourceCategory.BUSINESS],
  };

  return priorityMap[priority] || Object.values(RssFeedSourceCategory);
}

  /**
   * Log job execution results
   */
  private async logJobExecution(
    result: { success: number; errors: number },
    duration: number,
    priority?: string
  ): Promise<void> {
    try {
      console.info('Job execution logged:', {
        type: 'rss_feed_fetch',
        priority: priority || 'all',
        success_count: result.success,
        error_count: result.errors,
        duration_ms: duration,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to log job execution:', error);
    }
  }

  /**
   * Handle job errors
   */
  private async handleJobError(error: any, priority?: string): Promise<void> {
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
  public stopAllJobs(): void {
    this.scheduledTasks.forEach((task) => task.stop());
    console.info('All RSS Feed cron jobs stopped');
  }

  /**
   * ✅ Get job status
   */
  public getJobStatus(): JobStatus {
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
  private estimateNextExecution(): string {
    if (!this.scheduledTasks.length) return 'No scheduled jobs';
    const now = new Date();
    const next = new Date(now.getTime() + 30 * 60 * 1000); // rough estimate
    return next.toISOString();
  }
}


