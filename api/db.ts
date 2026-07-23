import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'data', 'monitor.db');

let db: Database.Database | null = null;

import fs from 'fs';

export function initDb(): Database.Database {
  if (db) return db;

  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // 创建表
  db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      summary TEXT,
      key_points TEXT DEFAULT '[]',
      positive_score REAL DEFAULT 0,
      negative_score REAL DEFAULT 0,
      overall_score REAL DEFAULT 0,
      rating TEXT DEFAULT 'fair',
      positive_analysis TEXT,
      negative_analysis TEXT,
      overall_analysis TEXT,
      article_count INTEGER DEFAULT 0,
      source_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      summary TEXT,
      source TEXT,
      source_type TEXT,
      source_url TEXT,
      sentiment TEXT DEFAULT 'neutral',
      sentiment_score REAL DEFAULT 0.5,
      key_points TEXT DEFAULT '[]',
      published_date TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_articles_report_id ON articles(report_id);
    CREATE INDEX IF NOT EXISTS idx_reports_date ON reports(date);
  `);

  return db;
}

export function getDbInstance(): Database.Database {
  return initDb();
}

// 数据库操作函数
export function saveReport(report: {
  date: string;
  summary: string;
  keyPoints: string[];
  positiveScore: number;
  negativeScore: number;
  overallScore: number;
  rating: string;
  positiveAnalysis: string;
  negativeAnalysis: string;
  overallAnalysis: string;
  articleCount: number;
  sourceCount: number;
  articles: Array<{
    title: string;
    summary: string;
    source: string;
    sourceType: string;
    sourceUrl: string;
    sentiment: string;
    sentimentScore: number;
    keyPoints: string[];
    publishedDate: string;
  }>;
}): number {
  const database = getDbInstance();

  // 删除当天已有报告（如果存在）
  const existing = database.prepare('SELECT id FROM reports WHERE date = ?').get(report.date) as { id: number } | undefined;
  if (existing) {
    database.prepare('DELETE FROM articles WHERE report_id = ?').run(existing.id);
    database.prepare('DELETE FROM reports WHERE id = ?').run(existing.id);
  }

  // 插入报告
  const result = database.prepare(`
    INSERT INTO reports (date, summary, key_points, positive_score, negative_score, overall_score, rating, positive_analysis, negative_analysis, overall_analysis, article_count, source_count, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    report.date,
    report.summary,
    JSON.stringify(report.keyPoints),
    report.positiveScore,
    report.negativeScore,
    report.overallScore,
    report.rating,
    report.positiveAnalysis,
    report.negativeAnalysis,
    report.overallAnalysis,
    report.articleCount,
    report.sourceCount
  );

  const reportId = result.lastInsertRowid as number;

  // 插入文章
  const insertArticle = database.prepare(`
    INSERT INTO articles (report_id, title, summary, source, source_type, source_url, sentiment, sentiment_score, key_points, published_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = database.transaction((articles: typeof report.articles) => {
    for (const article of articles) {
      insertArticle.run(
        reportId,
        article.title,
        article.summary,
        article.source,
        article.sourceType,
        article.sourceUrl,
        article.sentiment,
        article.sentimentScore,
        JSON.stringify(article.keyPoints),
        article.publishedDate
      );
    }
  });

  insertMany(report.articles);

  return reportId;
}

export function getReportByDate(date: string): ReportRow | undefined {
  const database = getDbInstance();
  return database.prepare('SELECT * FROM reports WHERE date = ?').get(date) as ReportRow | undefined;
}

export function getArticlesByReportId(reportId: number): ArticleRow[] {
  const database = getDbInstance();
  return database.prepare('SELECT * FROM articles WHERE report_id = ? ORDER BY id ASC').all(reportId) as ArticleRow[];
}

export function getTodayReport(): ReportRow | undefined {
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Shanghai' });
  return getReportByDate(today);
}

export function getHistory(page: number, limit: number): { total: number; reports: ReportRow[] } {
  const database = getDbInstance();
  const offset = (page - 1) * limit;
  const total = (database.prepare('SELECT COUNT(*) as count FROM reports ORDER BY date DESC').get() as { count: number }).count;
  const reports = database.prepare('SELECT * FROM reports ORDER BY date DESC LIMIT ? OFFSET ?').all(limit, offset) as ReportRow[];
  return { total, reports };
}

export interface ReportRow {
  id: number;
  date: string;
  summary: string;
  key_points: string;
  positive_score: number;
  negative_score: number;
  overall_score: number;
  rating: string;
  positive_analysis: string;
  negative_analysis: string;
  overall_analysis: string;
  article_count: number;
  source_count: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleRow {
  id: number;
  report_id: number;
  title: string;
  summary: string;
  source: string;
  source_type: string;
  source_url: string;
  sentiment: string;
  sentiment_score: number;
  key_points: string;
  published_date: string;
  created_at: string;
}
