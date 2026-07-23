import type { RawArticle } from '../types.js';
import { fetchPage, cleanText, cheerio, SEARCH_KEYWORDS } from './base.js';

// 行业网站搜索 - 通过搜索引擎限定行业域名
async function scrapeIndustryViaSearch(keyword: string): Promise<RawArticle[]> {
  const articles: RawArticle[] = [];

  // 限定海运/物流行业网站
  const industrySites = [
    'chinaports.com',      // 中国港口网
    'xindemarine.com',     // 信德海事网
    'maritimechina.com',   // 中国海事服务网
    'cnss.com.cn',         // 中国海事新闻网
    'ship.sh',             // 中国船舶在线
    'logistics.ctimes.com.cn', // 物流时代
  ];

  // 通过百度搜索限定行业网站
  const siteFilter = industrySites.map(s => `site:${s}`).join(' | ');
  const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword + ' ' + siteFilter)}&tn=news`;

  const html = await fetchPage(searchUrl);
  if (!html) return articles;

  const $ = cheerio.load(html);

  $('.result.c-container').each((_, el) => {
    const titleEl = $(el).find('h3 a').first();
    const title = cleanText(titleEl.text());
    const link = titleEl.attr('href') || '';
    const snippet = cleanText($(el).find('.c-summary').first().text());
    const sourceText = cleanText($(el).find('.c-color-gray').first().text());

    if (title) {
      // 尝试从来源中提取网站名
      const sourceMatch = sourceText.match(/(\w+\.\w+)/);
      const source = sourceMatch ? sourceMatch[1] : '行业网站';

      articles.push({
        title,
        content: snippet,
        snippet,
        source,
        sourceType: 'industry',
        sourceUrl: link,
        publishedDate: '',
      });
    }
  });

  return articles;
}

// 直接搜索行业综合信息
async function scrapeGeneralIndustry(keyword: string): Promise<RawArticle[]> {
  const articles: RawArticle[] = [];

  // 通过 Bing 搜索海运相关
  const url = `https://www.bing.com/search?q=${encodeURIComponent(keyword + ' 集装箱 海运 港口')}`;

  const html = await fetchPage(url);
  if (!html) return articles;

  const $ = cheerio.load(html);

  $('.b_algo').each((_, el) => {
    const titleEl = $(el).find('h2 a').first();
    const title = cleanText(titleEl.text());
    const link = titleEl.attr('href') || '';
    const snippet = cleanText($(el).find('.b_caption p').first().text());

    if (title && snippet) {
      articles.push({
        title,
        content: snippet,
        snippet,
        source: '行业搜索',
        sourceType: 'industry',
        sourceUrl: link,
        publishedDate: '',
      });
    }
  });

  return articles;
}

// 主函数：遍历所有关键词搜索行业信息
export async function scrapeIndustry(): Promise<RawArticle[]> {
  const allArticles: RawArticle[] = [];

  const keywordResults = await Promise.all(
    SEARCH_KEYWORDS.map(keyword =>
      Promise.allSettled([
        scrapeIndustryViaSearch(keyword),
        scrapeGeneralIndustry(keyword),
      ])
    )
  );

  for (const results of keywordResults) {
    for (const result of results) {
      if (result.status === 'fulfilled') allArticles.push(...result.value);
    }
  }

  console.log(`[IndustryScraper] 共获取 ${allArticles.length} 条行业信息`);
  return allArticles;
}
