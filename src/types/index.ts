export type SourceType = 'news' | 'wechat' | 'weibo' | 'industry';
export type Sentiment = 'positive' | 'negative' | 'neutral';
export type Rating = 'excellent' | 'good' | 'fair' | 'poor';

export interface Article {
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

export interface Report {
  id: number;
  date: string;
  updatedAt: string;
  articleCount: number;
  sourceCount: number;
  summary: string;
  keyPoints: string[];
  positiveScore: number;
  negativeScore: number;
  neutralScore: number;
  overallScore: number;
  rating: Rating;
  positiveAnalysis: string;
  negativeAnalysis: string;
  neutralAnalysis: string;
  overallAnalysis: string;
  articles: Article[];
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
