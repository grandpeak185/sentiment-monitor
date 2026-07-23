import type { RawArticle } from '../types.js';
import { deduplicateArticles, filterArticlesByDate, filterOutStockInfo, filterIrrelevantArticles } from './base.js';
import { scrapeNews } from './news.js';
import { scrapeWechat } from './wechat.js';
import { scrapeWeibo } from './weibo.js';
import { scrapeIndustry } from './industry.js';

// 执行所有爬虫并返回去重后的文章列表
export async function scrapeAll(): Promise<RawArticle[]> {
  console.log('[ScraperPool] 开始搜索...');

  const [news, wechat, weibo, industry] = await Promise.allSettled([
    scrapeNews(),
    scrapeWechat(),
    scrapeWeibo(),
    scrapeIndustry(),
  ]);

  const allArticles: RawArticle[] = [];

  if (news.status === 'fulfilled') allArticles.push(...news.value);
  if (wechat.status === 'fulfilled') allArticles.push(...wechat.value);
  if (weibo.status === 'fulfilled') allArticles.push(...weibo.value);
  if (industry.status === 'fulfilled') allArticles.push(...industry.value);

  // 1. 过滤无关文章（仅保留与目标公司相关的）
  let filtered = filterIrrelevantArticles(allArticles);
  // 2. 过滤股市信息（该公司非上市公司）
  filtered = filterOutStockInfo(filtered);
  // 3. 过滤 2025年1月之前的文章
  filtered = filterArticlesByDate(filtered);
  // 4. 去重
  const uniqueArticles = deduplicateArticles(filtered);

  // 统计来源数
  const sources = new Set(uniqueArticles.map(a => a.source));
  console.log(`[ScraperPool] 搜索完成: ${uniqueArticles.length} 条文章, ${sources.size} 个来源`);

  return uniqueArticles;
}
