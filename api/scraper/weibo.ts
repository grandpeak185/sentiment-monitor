import axios from 'axios';
import type { RawArticle } from '../types.js';
import { fetchPage, cleanText, cheerio, HEADERS, SEARCH_KEYWORDS } from './base.js';

// 通过移动端 API 搜索微博
async function scrapeWeiboMobile(keyword: string): Promise<RawArticle[]> {
  const articles: RawArticle[] = [];
  const url = `https://m.weibo.cn/api/container/getIndex?containerid=100103type%3D1%26q%3D${encodeURIComponent(keyword)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        ...HEADERS,
        'Referer': 'https://m.weibo.cn/',
        'MWeibo-Pwa': '1',
      },
      timeout: 15000,
    });

    const data = response.data;
    if (data.ok !== 1 || !data.data?.cards) return articles;

    for (const card of data.data.cards) {
      // card_group 里的微博
      if (card.card_group) {
        for (const subCard of card.card_group) {
          if (subCard.card_type === 9 && subCard.mblog) {
            const mblog = subCard.mblog;
            const text = cleanText((mblog.text || '').replace(/<[^>]+>/g, ' '));
            if (!text) continue;

            articles.push({
              title: text.substring(0, 50),
              content: text,
              snippet: text.substring(0, 200),
              source: mblog.user?.screen_name || '新浪微博',
              sourceType: 'weibo',
              sourceUrl: `https://m.weibo.cn/detail/${mblog.id}`,
              publishedDate: mblog.created_at || '',
            });
          }
        }
      }
      // 直接是微博卡片
      if (card.card_type === 9 && card.mblog) {
        const mblog = card.mblog;
        const text = cleanText((mblog.text || '').replace(/<[^>]+>/g, ' '));
        if (!text) continue;

        articles.push({
          title: text.substring(0, 50),
          content: text,
          snippet: text.substring(0, 200),
          source: mblog.user?.screen_name || '新浪微博',
          sourceType: 'weibo',
          sourceUrl: `https://m.weibo.cn/detail/${mblog.id}`,
          publishedDate: mblog.created_at || '',
        });
      }
    }
  } catch (error) {
    console.error(`[WeiboScraper] 移动端API请求失败: ${error instanceof Error ? error.message : String(error)}`);
  }

  return articles;
}

// 通过网页版搜索微博（备用）
async function scrapeWeiboWeb(keyword: string): Promise<RawArticle[]> {
  const articles: RawArticle[] = [];
  const url = `https://s.weibo.com/weibo?q=${encodeURIComponent(keyword)}`;

  const html = await fetchPage(url);
  if (!html) return articles;

  const $ = cheerio.load(html);

  $('.card-wrap[mid]').each((_, el) => {
    const contentEl = $(el).find('.content p[node-type="feed_list_content"]');
    const text = cleanText(contentEl.text());
    if (!text) return;

    const userEl = $(el).find('.info .name');
    const user = cleanText(userEl.text()) || '新浪微博';

    const timeEl = $(el).find('.from a:last-child');
    const publishedDate = cleanText(timeEl.text());

    const linkEl = $(el).find('.from a:first-child');
    const link = linkEl.attr('href') || '';

    articles.push({
      title: text.substring(0, 50),
      content: text,
      snippet: text.substring(0, 200),
      source: user,
      sourceType: 'weibo',
      sourceUrl: link.startsWith('http') ? link : `https://weibo.com${link}`,
      publishedDate,
    });
  });

  return articles;
}

// 主函数：遍历所有关键词搜索微博
export async function scrapeWeibo(): Promise<RawArticle[]> {
  const allArticles: RawArticle[] = [];

  const keywordResults = await Promise.all(
    SEARCH_KEYWORDS.map(keyword =>
      Promise.allSettled([
        scrapeWeiboMobile(keyword),
        scrapeWeiboWeb(keyword),
      ])
    )
  );

  for (const results of keywordResults) {
    for (const result of results) {
      if (result.status === 'fulfilled') allArticles.push(...result.value);
    }
  }

  console.log(`[WeiboScraper] 共获取 ${allArticles.length} 条微博`);
  return allArticles;
}
