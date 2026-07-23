import type { RawArticle, AnalyzedArticle } from '../types.js';
import { analyzeSentiment } from './sentiment.js';
import { summarize, extractKeyPoints, summarizeMultiple } from './summarizer.js';
import { calculateScores, type ScoreResult } from './scorer.js';

// 分析单篇文章
export function analyzeArticle(article: RawArticle): AnalyzedArticle {
  const text = `${article.title} ${article.snippet} ${article.content}`.substring(0, 5000);
  const sentimentResult = analyzeSentiment(text);
  const summary = summarize(`${article.title}。${article.snippet || article.content.substring(0, 1000)}`, 2);
  const keyPoints = extractKeyPoints(`${article.title}。${article.snippet || article.content.substring(0, 1000)}`, 3);

  return {
    ...article,
    summary,
    sentiment: sentimentResult.sentiment,
    sentimentScore: sentimentResult.score,
    keyPoints,
  };
}

// 分析所有文章并生成报告
export interface AnalysisResult extends ScoreResult {
  articles: AnalyzedArticle[];
  summary: string;
  keyPoints: string[];
}

export function analyzeAll(rawArticles: RawArticle[]): AnalysisResult {
  // 分析每篇文章
  const articles = rawArticles.map(analyzeArticle);

  // 生成综合摘要
  const { summary, keyPoints } = summarizeMultiple(
    articles.map(a => ({ title: a.title, content: a.content, snippet: a.snippet }))
  );

  // 计算评分
  const scores = calculateScores(articles);

  return {
    ...scores,
    articles,
    summary,
    keyPoints,
  };
}
