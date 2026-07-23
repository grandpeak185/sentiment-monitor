import type { RawArticle } from '../types.js';
import { fetchPage, cleanText, cheerio, SEARCH_KEYWORDS } from './base.js';

// 搜狗微信搜索
async function scrapeSogouWechat(keyword: string): Promise<RawArticle[]> {
  const articles: RawArticle[] = [];
  const url = `https://weixin.sogou.com/weixin?type=2&query=${encodeURIComponent(keyword)}&ie=utf8`;

  const html = await fetchPage(url);
  if (!html) return articles;

  const $ = cheerio.load(html);

  // 搜狗微信文章列表
  $('.news-list li, .news-box .news-list li, .txt-box').each((_, el) => {
    const titleEl = $(el).find('h3 a, .tit a').first();
    const title = cleanText(titleEl.text());
    const link = titleEl.attr('href') || '';

    const snippet = cleanText($(el).find('.txt-info, p.txt-info').first().text());

    // 来源公众号名称
    const accountEl = $(el).find('.account, .s-p a').first();
    const account = cleanText(accountEl.text()) || '微信公众号';

    // 发布时间
    const timeEl = $(el).find('.s2, .s-p').last();
    const publishedDate = cleanText(timeEl.text());

    if (title && link) {
      const fullUrl = link.startsWith('http') ? link : `https://weixin.sogou.com${link}`;
      articles.push({
        title,
        content: snippet,
        snippet,
        source: account,
        sourceType: 'wechat',
        sourceUrl: fullUrl,
        publishedDate,
      });
    }
  });

  return articles;
}

// 备用：通过搜索引擎搜索微信公众号文章
async function scrapeWechatViaBaidu(keyword: string): Promise<RawArticle[]> {
  const articles: RawArticle[] = [];
  const url = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword + ' site:mp.weixin.qq.com')}&tn=news`;

  const html = await fetchPage(url);
  if (!html) return articles;

  const $ = cheerio.load(html);

  $('.result.c-container').each((_, el) => {
    const titleEl = $(el).find('h3 a').first();
    const title = cleanText(titleEl.text());
    const link = titleEl.attr('href') || '';
    const snippet = cleanText($(el).find('.c-summary').first().text());

    if (title) {
      articles.push({
        title,
        content: snippet,
        snippet,
        source: '微信公众号',
        sourceType: 'wechat',
        sourceUrl: link,
        publishedDate: '',
      });
    }
  });

  return articles;
}

// 主函数：遍历所有关键词搜索公众号文章
export async function scrapeWechat(): Promise<RawArticle[]> {
  const allArticles: RawArticle[] = [];

  const keywordResults = await Promise.all(
    SEARCH_KEYWORDS.map(keyword =>
      Promise.allSettled([
        scrapeSogouWechat(keyword),
        scrapeWechatViaBaidu(keyword),
      ])
    )
  );

  for (const results of keywordResults) {
    for (const result of results) {
      if (result.status === 'fulfilled') allArticles.push(...result.value);
    }
  }

  console.log(`[WechatScraper] 共获取 ${allArticles.length} 条公众号文章`);
  return allArticles;
}
