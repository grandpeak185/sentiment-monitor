import type { AnalyzedArticle, Rating } from '../types.js';

export interface ScoreResult {
  positiveScore: number;
  negativeScore: number;
  overallScore: number;
  rating: Rating;
  positiveAnalysis: string;
  negativeAnalysis: string;
  overallAnalysis: string;
}

export function calculateScores(articles: AnalyzedArticle[]): ScoreResult {
  if (articles.length === 0) {
    return {
      positiveScore: 50,
      negativeScore: 50,
      overallScore: 50,
      rating: 'fair',
      positiveAnalysis: '今日未搜集到正面信息。',
      negativeAnalysis: '今日未搜集到负面信息。',
      overallAnalysis: '今日暂无足够数据进行分析评价，请等待下次更新。',
    };
  }

  const total = articles.length;
  const positiveArticles = articles.filter(a => a.sentiment === 'positive');
  const negativeArticles = articles.filter(a => a.sentiment === 'negative');
  const neutralArticles = articles.filter(a => a.sentiment === 'neutral');

  // 正面得分：正面文章占比 * 平均正面情感分数
  const positiveRatio = positiveArticles.length / total;
  const avgPositiveScore = positiveArticles.length > 0
    ? positiveArticles.reduce((sum, a) => sum + a.sentimentScore, 0) / positiveArticles.length
    : 0.5;
  const positiveScore = Math.round(positiveRatio * 60 + avgPositiveScore * 40);

  // 负面得分：负面文章占比 * 平均负面情感分数
  const negativeRatio = negativeArticles.length / total;
  const avgNegativeScore = negativeArticles.length > 0
    ? negativeArticles.reduce((sum, a) => sum + (1 - a.sentimentScore), 0) / negativeArticles.length
    : 0;
  const negativeScore = Math.round(negativeRatio * 60 + avgNegativeScore * 40);

  // 综合得分：正面得分 - 负面得分*0.8，映射到 0-100
  const rawScore = positiveScore * 0.6 + (100 - negativeScore) * 0.4;
  const overallScore = Math.round(Math.max(0, Math.min(100, rawScore)));

  // 评级
  let rating: Rating;
  if (overallScore >= 80) rating = 'excellent';
  else if (overallScore >= 60) rating = 'good';
  else if (overallScore >= 40) rating = 'fair';
  else rating = 'poor';

  // 红方分析（正面）
  const positivePoints = positiveArticles
    .map(a => a.keyPoints[0] || a.title)
    .slice(0, 5);
  const positiveAnalysis = generatePositiveAnalysis(positiveArticles, positiveScore, positivePoints);

  // 绿方分析（负面）
  const negativePoints = negativeArticles
    .map(a => a.keyPoints[0] || a.title)
    .slice(0, 5);
  const negativeAnalysis = generateNegativeAnalysis(negativeArticles, negativeScore, negativePoints);

  // 综合评语
  const overallAnalysis = generateOverallAnalysis(
    overallScore, rating, total, positiveArticles.length, negativeArticles.length, neutralArticles.length
  );

  return {
    positiveScore,
    negativeScore,
    overallScore,
    rating,
    positiveAnalysis,
    negativeAnalysis,
    overallAnalysis,
  };
}

function generatePositiveAnalysis(
  articles: AnalyzedArticle[],
  score: number,
  points: string[]
): string {
  if (articles.length === 0) {
    return '今日未监测到明显正面舆情信息。';
  }

  let analysis = `今日共监测到 ${articles.length} 条正面信息，正面得分 ${score} 分。`;
  analysis += `主要正面信息集中在以下方面：\n`;
  points.forEach((p, i) => {
    analysis += `${i + 1}. ${p}\n`;
  });

  if (score >= 70) {
    analysis += '\n整体正面舆情表现突出，公司在各方面获得良好反响。';
  } else if (score >= 50) {
    analysis += '\n整体正面舆情表现尚可，有一定积极信号。';
  } else {
    analysis += '\n正面舆情信号较弱，正面信息数量有限。';
  }

  return analysis;
}

function generateNegativeAnalysis(
  articles: AnalyzedArticle[],
  score: number,
  points: string[]
): string {
  if (articles.length === 0) {
    return '今日未监测到明显负面舆情信息，舆情状况良好。';
  }

  let analysis = `今日共监测到 ${articles.length} 条负面信息，负面得分 ${score} 分。`;
  analysis += `主要负面信息集中在以下方面：\n`;
  points.forEach((p, i) => {
    analysis += `${i + 1}. ${p}\n`;
  });

  if (score >= 70) {
    analysis += '\n负面舆情压力较大，建议密切关注并及时应对。';
  } else if (score >= 50) {
    analysis += '\n存在一定负面舆情，建议持续关注事态发展。';
  } else {
    analysis += '\n负面舆情处于可控范围，对整体影响有限。';
  }

  return analysis;
}

function generateOverallAnalysis(
  score: number,
  rating: Rating,
  total: number,
  positive: number,
  negative: number,
  neutral: number
): string {
  const ratingText: Record<Rating, string> = {
    excellent: '优',
    good: '良',
    fair: '中',
    poor: '差',
  };

  let analysis = `今日共搜集到 ${total} 条相关信息，其中正面 ${positive} 条、负面 ${negative} 条、中性 ${neutral} 条。`;
  analysis += `综合评分为 ${score} 分，评级为"${ratingText[rating]}"。`;

  switch (rating) {
    case 'excellent':
      analysis += '公司舆情整体表现优异，正面信息占主导，品牌形象良好，建议继续保持当前运营策略。';
      break;
    case 'good':
      analysis += '公司舆情整体表现良好，正面信息较多，建议关注少量负面信息并及时处理。';
      break;
    case 'fair':
      analysis += '公司舆情表现一般，正负面信息较为均衡，建议加强正面宣传，同时关注潜在风险。';
      break;
    case 'poor':
      analysis += '公司舆情表现不佳，负面信息较多，建议立即排查问题原因并制定应对策略。';
      break;
  }

  return analysis;
}
