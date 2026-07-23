// TextRank 提取式摘要 + 关键信息提取

// 中文句子分割
function splitSentences(text: string): string[] {
  // 按句号、问号、感叹号、分号分割，同时处理中英文标点
  const sentences = text
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .split(/[。！？；!?\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 5); // 过滤太短的片段
  return sentences;
}

// 简单的中文分词（基于词典和标点）
function tokenize(text: string): string[] {
  // 移除标点和特殊字符
  const cleaned = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ');
  // 按2-4字滑窗提取词组（简化版）
  const tokens: string[] = [];
  const chars = cleaned.split(/\s+/).join('');

  // 提取2字和3字词组
  for (let i = 0; i < chars.length - 1; i++) {
    if (i < chars.length - 1) tokens.push(chars.substring(i, i + 2));
  }

  return tokens;
}

// 计算两个句子的相似度（基于词重叠）
function sentenceSimilarity(s1: string, s2: string): number {
  const tokens1 = new Set(tokenize(s1));
  const tokens2 = new Set(tokenize(s2));

  const intersection = [...tokens1].filter(t => tokens2.has(t)).length;
  const union = tokens1.size + tokens2.size;

  if (union === 0) return 0;
  return intersection / union;
}

// TextRank 算法
function textRank(sentences: string[], iterations: number = 50, d: number = 0.85): number[] {
  const n = sentences.length;
  if (n === 0) return [];
  if (n === 1) return [1];

  // 构建相似度矩阵
  const similarityMatrix: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        similarityMatrix[i][j] = sentenceSimilarity(sentences[i], sentences[j]);
      }
    }
  }

  // 归一化
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += similarityMatrix[i][j];
    }
    if (sum > 0) {
      for (let i = 0; i < n; i++) {
        similarityMatrix[i][j] /= sum;
      }
    }
  }

  // PageRank 迭代
  let scores = Array(n).fill(1 / n);
  for (let iter = 0; iter < iterations; iter++) {
    const newScores = Array(n).fill((1 - d) / n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          newScores[i] += d * similarityMatrix[j][i] * scores[j];
        }
      }
    }
    scores = newScores;
  }

  return scores;
}

// 生成摘要
export function summarize(text: string, maxSentences: number = 3): string {
  const sentences = splitSentences(text);
  if (sentences.length <= maxSentences) {
    return sentences.join('。') + '。';
  }

  const scores = textRank(sentences);

  // 按得分排序，选取前 N 个句子
  const ranked = sentences.map((sentence, index) => ({
    sentence,
    score: scores[index],
    originalIndex: index,
  }));

  ranked.sort((a, b) => b.score - a.score);
  const selected = ranked.slice(0, maxSentences);

  // 按原文顺序排列
  selected.sort((a, b) => a.originalIndex - b.originalIndex);

  return selected.map(s => s.sentence).join('。') + '。';
}

// 提取关键信息（关键短语）
export function extractKeyPoints(text: string, maxPoints: number = 5): string[] {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return [];

  const scores = textRank(sentences);

  // 按得分排序选取关键句
  const ranked = sentences.map((sentence, index) => ({
    sentence,
    score: scores[index],
  }));

  ranked.sort((a, b) => b.score - a.score);

  return ranked
    .slice(0, maxPoints)
    .map(item => {
      // 截取每句的前80个字符作为关键信息
      const s = item.sentence.trim();
      return s.length > 80 ? s.substring(0, 80) + '...' : s;
    });
}

// 多文章综合摘要
export function summarizeMultiple(articles: Array<{ title: string; content: string; snippet: string }>): {
  summary: string;
  keyPoints: string[];
} {
  if (articles.length === 0) {
    return { summary: '今日暂未搜集到相关信息。', keyPoints: [] };
  }

  // 合并所有文章内容
  const allText = articles
    .map(a => `${a.title}。${a.snippet || a.content.substring(0, 500)}`)
    .join('\n');

  const summary = summarize(allText, 4);
  const keyPoints = extractKeyPoints(allText, 6);

  return { summary, keyPoints };
}
