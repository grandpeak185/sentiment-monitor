import type { RawArticle } from '../types.js';
import { fetchPage, cleanText, cheerio, SEARCH_KEYWORDS } from './base.js';

// 百度新闻搜索
async function scrapeBaiduNews(keyword: string): Promise<RawArticle[]> {
  const articles: RawArticle[] = [];
  const url = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}&tn=news&rtt=1&medium=0`;

  const html = await fetchPage(url);
  if (!html) return articles;

  const $ = cheerio.load(html);

  // 百度搜索结果
  $('.result.c-container, .content-right_8Zs40').each((_, el) => {
    const titleEl = $(el).find('h3 a, .news-title-font_1xS-F a').first();
    const title = cleanText(titleEl.text());
    const link = titleEl.attr('href') || '';
    const snippet = cleanText($(el).find('.c-summary, .c-span-last, .news-summary').first().text());
    const sourceText = cleanText($(el).find('.c-color-gray, .c-gap-right-xsmall, .source').first().text());
    const dateMatch = sourceText.match(/\d{4}年\d{1,2}月\d{1,2}日|\d{1,2}小时前|\d{1,2}分钟前|昨天|今天|\d{1,2}月\d{1,2}日/);
    const publishedDate = dateMatch ? dateMatch[0] : '';

    if (title && title.includes(keyword.substring(0, 4))) {
      articles.push({
        title,
        content: snippet,
        snippet,
        source: sourceText.split(/\s/)[0] || '百度新闻',
        sourceType: 'news',
        sourceUrl: link,
        publishedDate,
      });
    }
  });

  return articles;
}

// Bing 新闻搜索
async function scrapeBingNews(keyword: string): Promise<RawArticle[]> {
  const articles: RawArticle[] = [];
  const url = `https://www.bing.com/news/search?q=${encodeURIComponent(keyword)}&qft=sortbydate%3d%221%22`;

  const html = await fetchPage(url);
  if (!html) return articles;

  const $ = cheerio.load(html);

  // Bing 新闻搜索结果
  $('.news-card.newsitem, .t_t').each((_, el) => {
    const titleEl = $(el).find('.title, a.title').first();
    const title = cleanText(titleEl.text());
    const link = titleEl.attr('href') || $(el).attr('url') || '';
    const snippet = cleanText($(el).find('.snippet, .rss_txt').first().text());
    const source = cleanText($(el).find('.source, .t_meta').first().text()) || 'Bing新闻';
    const publishedDate = cleanText($(el).find('.datetime, .time').first().text());

    if (title) {
      articles.push({
        title,
        content: snippet,
        snippet,
        source,
        sourceType: 'news',
        sourceUrl: link,
        publishedDate,
      });
    }
  });

  return articles;
}

// 搜狗新闻搜索
async function scrapeSogouNews(keyword: string): Promise<RawArticle[]> {
  const articles: RawArticle[] = [];
  const url = `https://news.sogou.com/news?query=${encodeURIComponent(keyword)}&sort=1`;

  const html = await fetchPage(url);
  if (!html) return articles;

  const $ = cheerio.load(html);

  $('.vrwrap, .news-item').each((_, el) => {
    const titleEl = $(el).find('h3 a, .news-title a').first();
    const title = cleanText(titleEl.text());
    const link = titleEl.attr('href') || '';
    const snippet = cleanText($(el).find('.star-wiki, .s-p, .news-text').first().text());
    const sourceText = cleanText($(el).find('.news-source, .s-p cite').first().text());
    const publishedDate = '';

    if (title) {
      articles.push({
        title,
        content: snippet,
        snippet,
        source: sourceText || '搜狗新闻',
        sourceType: 'news',
        sourceUrl: link.startsWith('http') ? link : `https://news.sogou.com${link}`,
        publishedDate,
      });
    }
  });

  return articles;
}

// 主函数：遍历所有关键词搜索全部新闻源
export async function scrapeNews(): Promise<RawArticle[]> {
  const allArticles: RawArticle[] = [];

  // 遍历所有关键词，每个关键词并行搜索百度/Bing/搜狗
  const keywordResults = await Promise.all(
    SEARCH_KEYWORDS.map(keyword =>
      Promise.allSettled([
        scrapeBaiduNews(keyword),
        scrapeBingNews(keyword),
        scrapeSogouNews(keyword),
      ])
    )
  );

  for (const results of keywordResults) {
    for (const result of results) {
      if (result.status === 'fulfilled') allArticles.push(...result.value);
    }
  }

  console.log(`[NewsScraper] 共获取 ${allArticles.length} 条新闻`);
  return allArticles;
}
