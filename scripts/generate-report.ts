import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { scrapeAll } from '../api/scraper/index.js';
import { analyzeAll } from '../api/analyzer/index.js';
import { getBeijingDate } from '../api/scraper/base.js';
import type { Report, HistoryItem, HistoryResponse } from '../src/types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'public', 'data', 'reports');
const INDEX_FILE = join(DATA_DIR, 'index.json');
const LATEST_FILE = join(DATA_DIR, 'latest.json');

// 确保目录存在
function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// 读取 index.json
function readIndex(): HistoryResponse {
  if (!existsSync(INDEX_FILE)) {
    return { total: 0, page: 1, limit: 50, reports: [] };
  }
  try {
    return JSON.parse(readFileSync(INDEX_FILE, 'utf-8'));
  } catch {
    return { total: 0, page: 1, limit: 50, reports: [] };
  }
}

// 保存 index.json
function saveIndex(index: HistoryResponse) {
  ensureDir(DATA_DIR);
  writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
}

// 生成报告
async function generateReport(): Promise<void> {
  console.log('[GenerateReport] 开始生成报告...');

  const date = getBeijingDate();
  const now = new Date();
  const updatedAt = `${date} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  // 1. 爬取数据
  const rawArticles = await scrapeAll();

  let report: Report;

  if (rawArticles.length === 0) {
    console.log('[GenerateReport] 未搜集到任何信息，生成空报告');
    report = {
      id: Date.now(),
      date,
      updatedAt,
      articleCount: 0,
      sourceCount: 0,
      summary: '今日未搜集到相关信息。可能是搜索源暂时不可用或该公司今日无公开报道。',
      keyPoints: [],
      positiveScore: 50,
      negativeScore: 50,
      neutralScore: 50,
      overallScore: 50,
      rating: 'fair',
      positiveAnalysis: '今日未监测到正面舆情信息。',
      negativeAnalysis: '今日未监测到负面舆情信息。',
      neutralAnalysis: '今日未监测到中性舆情信息。',
      overallAnalysis: '今日暂无足够数据进行分析评价，请等待下次更新。',
      articles: [],
    };
  } else {
    // 2. AI 分析
    const analysis = analyzeAll(rawArticles);
    const sources = new Set(rawArticles.map(a => a.source));

    report = {
      id: Date.now(),
      date,
      updatedAt,
      articleCount: analysis.articles.length,
      sourceCount: sources.size,
      summary: analysis.summary,
      keyPoints: analysis.keyPoints,
      positiveScore: analysis.positiveScore,
      negativeScore: analysis.negativeScore,
      neutralScore: analysis.neutralScore,
      overallScore: analysis.overallScore,
      rating: analysis.rating,
      positiveAnalysis: analysis.positiveAnalysis,
      negativeAnalysis: analysis.negativeAnalysis,
      neutralAnalysis: analysis.neutralAnalysis,
      overallAnalysis: analysis.overallAnalysis,
      articles: analysis.articles.map((a, idx) => ({
        id: idx + 1,
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
    };
  }

  // 3. 保存报告文件
  ensureDir(DATA_DIR);

  // 保存最新报告
  writeFileSync(LATEST_FILE, JSON.stringify(report, null, 2));
  console.log(`[GenerateReport] 最新报告已保存: ${LATEST_FILE}`);

  // 保存日期报告
  const dateFile = join(DATA_DIR, `${date}.json`);
  writeFileSync(dateFile, JSON.stringify(report, null, 2));
  console.log(`[GenerateReport] 日期报告已保存: ${dateFile}`);

  // 4. 更新索引
  const index = readIndex();
  const historyItem: HistoryItem = {
    id: report.id,
    date: report.date,
    overallScore: report.overallScore,
    rating: report.rating,
    articleCount: report.articleCount,
    summary: report.summary.substring(0, 120),
  };

  // 如果已存在该日期的记录，替换；否则插入到开头
  const existingIndex = index.reports.findIndex(r => r.date === date);
  if (existingIndex >= 0) {
    index.reports[existingIndex] = historyItem;
  } else {
    index.reports.unshift(historyItem);
  }

  index.total = index.reports.length;
  saveIndex(index);
  console.log(`[GenerateReport] 索引已更新，共 ${index.total} 份报告`);
  console.log('[GenerateReport] 报告生成完成！');
}

// 执行
generateReport().catch(err => {
  console.error('[GenerateReport] 生成失败:', err);
  process.exit(1);
});
