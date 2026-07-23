import { Router, type Request, type Response } from 'express';
import { getTodayReportResponse, getReportResponseByDate, getHistoryResponse } from '../services/reportService.js';
import { triggerReportGeneration } from '../scheduler.js';
import { initDb } from '../db.js';

const router = Router();

// 初始化数据库
initDb();

// 获取今日报告
router.get('/today', (_req: Request, res: Response) => {
  try {
    const report = getTodayReportResponse();
    if (!report) {
      res.status(404).json({
        success: false,
        message: '今日报告尚未生成',
      });
      return;
    }
    res.json(report);
  } catch (error) {
    console.error('获取今日报告失败:', error);
    res.status(500).json({
      success: false,
      message: '获取今日报告失败',
    });
  }
});

// 获取历史报告列表
router.get('/history', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (page < 1 || limit < 1 || limit > 100) {
      res.status(400).json({
        success: false,
        message: '无效的分页参数',
      });
      return;
    }

    const result = getHistoryResponse(page, limit);
    res.json(result);
  } catch (error) {
    console.error('获取历史报告失败:', error);
    res.status(500).json({
      success: false,
      message: '获取历史报告失败',
    });
  }
});

// 获取指定日期报告
router.get('/:date', (req: Request, res: Response) => {
  try {
    const { date } = req.params;

    // 验证日期格式 YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({
        success: false,
        message: '日期格式应为 YYYY-MM-DD',
      });
      return;
    }

    const report = getReportResponseByDate(date);
    if (!report) {
      res.status(404).json({
        success: false,
        message: `${date} 的报告不存在`,
      });
      return;
    }
    res.json(report);
  } catch (error) {
    console.error('获取报告失败:', error);
    res.status(500).json({
      success: false,
      message: '获取报告失败',
    });
  }
});

// 手动触发更新
router.post('/refresh', async (_req: Request, res: Response) => {
  try {
    const result = await triggerReportGeneration();
    res.json(result);
  } catch (error) {
    console.error('触发更新失败:', error);
    res.status(500).json({
      success: false,
      message: '触发更新失败',
    });
  }
});

export default router;
