import { scrapeAll } from '../scraper/index.js';
import { analyzeAll } from '../analyzer/index.js';
import { saveReport, getReportByDate, getArticlesByReportId, getTodayReport, getHistory, type ReportRow, type ArticleRow } from '../db.js';
import type { ReportResponse, ArticleResponse, HistoryItem, HistoryResponse, Rating } from '../types.js';
import { getBeijingDate } from '../scraper/base.js';

// 执行完整的报告生成流程
export async function generateAndSaveReport(): Promise<{ success: boolean; articleCount: number; message: string }> {
  try {
    console.log('[ReportService] 开始生成报告...');

    // 1. 爬取数据
    const rawArticles = await scrapeAll();

    if (rawArticles.length === 0) {
      console.log('[ReportService] 未搜集到任何信息');
      // 仍然保存一个空报告
      const date = getBeijingDate();
      const reportId = saveReport({
        date,
        summary: '今日未搜集到相关信息。可能是搜索源暂时不可用或该公司今日无公开报道。',
        keyPoints: [],
        positiveScore: 50,
        negativeScore: 50,
        overallScore: 50,
        rating: 'fair',
        positiveAnalysis: '今日未监测到正面舆情信息。',
        negativeAnalysis: '今日未监测到负面舆情信息。',
        overallAnalysis: '今日暂无足够数据进行分析评价，请等待下次更新。',
        articleCount: 0,
        sourceCount: 0,
        articles: [],
      });
      console.log(`[ReportService] 空报告已保存, ID: ${reportId}`);
      return { success: true, articleCount: 0, message: '今日未搜集到相关信息' };
    }

    // 2. AI 分析
    const analysis = analyzeAll(rawArticles);

    // 3. 统计来源数
    const sources = new Set(rawArticles.map(a => a.source));

    // 4. 保存报告
    const date = getBeijingDate();
    const reportId = saveReport({
      date,
      summary: analysis.summary,
      keyPoints: analysis.keyPoints,
      positiveScore: analysis.positiveScore,
      negativeScore: analysis.negativeScore,
      overallScore: analysis.overallScore,
      rating: analysis.rating,
      positiveAnalysis: analysis.positiveAnalysis,
      negativeAnalysis: analysis.negativeAnalysis,
      overallAnalysis: analysis.overallAnalysis,
      articleCount: analysis.articles.length,
      sourceCount: sources.size,
      articles: analysis.articles.map(a => ({
        title: a.title,
        summary: a.summary,
        source: a.source,
        sourceType: a.sourceType,
        sourceUrl: a.sourceUrl,
        sentiment: a.sentiment,
        sentimentScore: a.sentimentScore,
        keyPoints: a.keyPoints,
        publishedDate: a.publishedDate,
      })),
    });

    console.log(`[ReportService] 报告已保存, ID: ${reportId}, 文章数: ${analysis.articles.length}`);
    return { success: true, articleCount: analysis.articles.length, message: '报告生成成功' };
  } catch (error) {
    console.error('[ReportService] 生成报告失败:', error);
    return { success: false, articleCount: 0, message: `生成报告失败: ${error instanceof Error ? error.message : String(error)}` };
  }
}

// 转换数据库行为 API 响应格式
function articleRowToResponse(row: ArticleRow): ArticleResponse {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary || '',
    source: row.source || '',
    sourceType: row.source_type as ArticleResponse['sourceType'],
    sourceUrl: row.source_url || '',
    sentiment: row.sentiment as ArticleResponse['sentiment'],
    sentimentScore: row.sentiment_score,
    keyPoints: JSON.parse(row.key_points || '[]'),
    publishedDate: row.published_date || '',
  };
}

// 转换数据库报告为 API 响应格式
function reportRowToResponse(row: ReportRow, articles: ArticleRow[]): ReportResponse {
  return {
    id: row.id,
    date: row.date,
    updatedAt: row.updated_at,
    articleCount: row.article_count,
    sourceCount: row.source_count,
    summary: row.summary || '',
    keyPoints: JSON.parse(row.key_points || '[]'),
    positiveScore: row.positive_score,
    negativeScore: row.negative_score,
    overallScore: row.overall_score,
    rating: row.rating as Rating,
    positiveAnalysis: row.positive_analysis || '',
    negativeAnalysis: row.negative_analysis || '',
    overallAnalysis: row.overall_analysis || '',
    articles: articles.map(articleRowToResponse),
  };
}

// 获取今日报告
export function getTodayReportResponse(): ReportResponse | null {
  const report = getTodayReport();
  if (!report) return null;

  const articles = getArticlesByReportId(report.id);
  return reportRowToResponse(report, articles);
}

// 获取指定日期报告
export function getReportResponseByDate(date: string): ReportResponse | null {
  const report = getReportByDate(date);
  if (!report) return null;

  const articles = getArticlesByReportId(report.id);
  return reportRowToResponse(report, articles);
}

// 获取历史报告列表
export function getHistoryResponse(page: number, limit: number): HistoryResponse {
  const { total, reports } = getHistory(page, limit);

  const items: HistoryItem[] = reports.map(row => ({
    id: row.id,
    date: row.date,
    overallScore: row.overall_score,
    rating: row.rating as Rating,
    articleCount: row.article_count,
    summary: (row.summary || '').substring(0, 120),
  }));

  return { total, page, limit, reports: items };
}
