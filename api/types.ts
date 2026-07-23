// 共享类型定义

export type SourceType = 'news' | 'wechat' | 'weibo' | 'industry';
export type Sentiment = 'positive' | 'negative' | 'neutral';
export type Rating = 'excellent' | 'good' | 'fair' | 'poor';

// 爬虫获取的原始文章
export interface RawArticle {
  title: string;
  content: string;
  snippet: string;
  source: string;
  sourceType: SourceType;
  sourceUrl: string;
  publishedDate: string;
}

// 分析后的文章
export interface AnalyzedArticle extends RawArticle {
  summary: string;
  sentiment: Sentiment;
  sentimentScore: number;
  keyPoints: string[];
}

// 报告响应
export interface ReportResponse {
  id: number;
  date: string;
  updatedAt: string;
  articleCount: number;
  sourceCount: number;
  summary: string;
  keyPoints: string[];
  positiveScore: number;
  negativeScore: number;
  overallScore: number;
  rating: Rating;
  positiveAnalysis: string;
  negativeAnalysis: string;
  overallAnalysis: string;
  articles: ArticleResponse[];
}

export interface ArticleResponse {
  id: number;
  title: string;
  summary: string;
  source: string;
  sourceType: SourceType;
  sourceUrl: string;
  sentiment: Sentiment;
  sentimentScore: number;
  keyPoints: string[];
  publishedDate: string;
}

export interface HistoryItem {
  id: number;
  date: string;
  overallScore: number;
  rating: Rating;
  articleCount: number;
  summary: string;
}

export interface HistoryResponse {
  total: number;
  page: number;
  limit: number;
  reports: HistoryItem[];
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  articleCount?: number;
}
