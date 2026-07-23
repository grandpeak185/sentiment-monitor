import cron from 'node-cron';
import { generateAndSaveReport } from './services/reportService.js';

let scheduledTask: cron.ScheduledTask | null = null;
let isRunning = false;

// 启动定时任务 - 每日北京时间 12:00 (UTC 04:00)
export function startScheduler(): void {
  if (scheduledTask) {
    console.log('[Scheduler] 定时任务已在运行');
    return;
  }

  // UTC 04:00 = 北京时间 12:00
  scheduledTask = cron.schedule('0 4 * * *', async () => {
    if (isRunning) {
      console.log('[Scheduler] 上一次任务仍在执行，跳过本次');
      return;
    }

    isRunning = true;
    console.log(`[Scheduler] 定时任务触发: ${new Date().toISOString()}`);

    try {
      const result = await generateAndSaveReport();
      console.log(`[Scheduler] 任务完成: ${result.message}`);
    } catch (error) {
      console.error('[Scheduler] 任务失败:', error);
    } finally {
      isRunning = false;
    }
  }, {
    timezone: 'UTC',
  });

  console.log('[Scheduler] 定时任务已启动 - 每日北京时间 12:00 执行');
}

// 停止定时任务
export function stopScheduler(): void {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log('[Scheduler] 定时任务已停止');
  }
}

// 手动触发报告生成
export async function triggerReportGeneration(): Promise<{ success: boolean; articleCount: number; message: string }> {
  if (isRunning) {
    return { success: false, articleCount: 0, message: '报告正在生成中，请稍后' };
  }

  isRunning = true;
  try {
    const result = await generateAndSaveReport();
    return result;
  } finally {
    isRunning = false;
  }
}
