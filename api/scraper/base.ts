import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';
import type { RawArticle } from '../types.js';

// 公司搜索关键词
export const COMPANY_NAME = '海南中远海运集装箱运输有限公司';
// 扩大覆盖：全称 + 分部名 + 简称
export const SEARCH_KEYWORDS = [
  '海南中远海运集装箱运输有限公司',
  '中远海运集运海南分部',
  '海南集运',
  '中远海运海南',
  '海南中远海运集装箱',
];

// 日期过滤下限：仅保留 2025 年 1 月及之后的文章（北京时间）
const MIN_DATE = new Date('2025-01-01T00:00:00+08:00');

// 通用请求头
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate',
  'Connection': 'keep-alive',
};

// 通用 HTTP 请求（自动检测编码）
export async function fetchPage(url: string, encoding: string = 'utf-8'): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: HEADERS,
      timeout: 15000,
      responseType: 'arraybuffer',
      maxRedirects: 5,
    });

    const buffer = Buffer.from(response.data);

    // 先用指定编码解码
    let html = iconv.decode(buffer, encoding);

    // 如果结果包含大量替换字符，尝试从 meta 标签检测编码
    if (html.includes('\uFFFD') || (encoding === 'utf-8' && /[\u0500-\uFFFF]{3,}/.test(html))) {
      // 检测 meta charset
      const charsetMatch = html.match(/charset=["']?([\w-]+)/i);
      if (charsetMatch) {
        const detected = charsetMatch[1].toLowerCase();
        if (detected !== encoding && (detected.includes('gb') || detected.includes('utf'))) {
          html = iconv.decode(buffer, detected);
        }
      }
      // 如果仍然有乱码，尝试其他编码
      if (html.includes('\uFFFD') && encoding === 'utf-8') {
        const gbkAttempt = iconv.decode(buffer, 'gb18030');
        if (!gbkAttempt.includes('\uFFFD')) {
          html = gbkAttempt;
        }
      } else if (html.includes('\uFFFD') && encoding !== 'utf-8') {
        const utf8Attempt = iconv.decode(buffer, 'utf-8');
        if (!utf8Attempt.includes('\uFFFD')) {
          html = utf8Attempt;
        }
      }
    }

    return html;
  } catch (error) {
    console.error(`[Scraper] 请求失败: ${url}`, error instanceof Error ? error.message : String(error));
    return '';
  }
}

// 清理 HTML 文本
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// 提取文章内容（通用）
export function extractContent($: cheerio.CheerioAPI, selectors: string[]): string {
  for (const selector of selectors) {
    const el = $(selector).first();
    if (el.length > 0) {
      // 移除脚本和样式
      el.find('script, style, .ad, .advertisement, .comment, .share').remove();
      const text = cleanText(el.text());
      if (text.length > 50) {
        return text;
      }
    }
  }
  return '';
}

// 去重
export function deduplicateArticles(articles: RawArticle[]): RawArticle[] {
  const seen = new Set<string>();
  const result: RawArticle[] = [];

  for (const article of articles) {
    // 使用标题前30个字符作为去重键
    const key = article.title.substring(0, 30).trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      result.push(article);
    }
  }

  return result;
}

// 日期截止线：仅保留 2025年1月及之后的文章
const DATE_CUTOFF = new Date('2025-01-01T00:00:00');

// 解析文章日期字符串，返回 Date 或 null（无法解析时）
function parseArticleDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const cleaned = dateStr.trim();

  // Unix 时间戳：document.write(timeConvert('1645524030'))
  const tsMatch = cleaned.match(/timeConvert\(['"](\d+)['"]\)/);
  if (tsMatch) return new Date(parseInt(tsMatch[1]) * 1000);

  // YYYY年MM月DD日
  const cnMatch = cleaned.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (cnMatch) return new Date(parseInt(cnMatch[1]), parseInt(cnMatch[2]) - 1, parseInt(cnMatch[3]));

  // YYYY-MM-DD 或 YYYY/MM/DD
  const isoMatch = cleaned.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));

  // 相对时间（视为当前时间）
  if (/小时前|分钟前|天前|昨天|今日|今天|刚刚|昨日/.test(cleaned)) return new Date();

  // 只有月日：MM月DD日（假设今年）
  const mdMatch = cleaned.match(/(\d{1,2})月(\d{1,2})日/);
  if (mdMatch) return new Date(new Date().getFullYear(), parseInt(mdMatch[1]) - 1, parseInt(mdMatch[2]));

  return null;
}

// 过滤掉 2025年1月之前的文章
export function filterArticlesByDate(articles: RawArticle[]): RawArticle[] {
  return articles.filter(article => {
    const date = parseArticleDate(article.publishedDate);
    // 无法解析日期则保留（避免误删）
    if (!date) return true;
    return date >= DATE_CUTOFF;
  });
}

// 股市相关关键词（该公司非上市公司，过滤股市信息）
const STOCK_KEYWORDS = [
  '股价', '涨停', '跌停', 'A股', 'H股', '市值', '市盈率', 'K线',
  '开盘价', '收盘价', '尾盘', '早盘', '涨跌幅', '成交量', '换手率',
  '中远海能', '招商轮船', '中远海控', '中远海发', '中远海特', '中远海科',
  '600026', '601872', '601919', '001919', '601866',
  '净利增', '净利润增', '营收增', '业绩快报', '业绩预告', '年报披露', '季报披露',
  '股票代码', '上市公', 'IPO', '增发', '回购方案',
];

// 过滤掉股市相关文章
export function filterOutStockInfo(articles: RawArticle[]): RawArticle[] {
  return articles.filter(article => {
    const text = `${article.title} ${article.snippet}`;
    return !STOCK_KEYWORDS.some(kw => text.includes(kw));
  });
}

// 实体相关关键词（用于判断文章是否与目标公司相关）
const ENTITY_KEYWORDS = [
  '海南中远海运集装箱',
  '中远海运集运海南',
  '海南集运',
  '中远海运海南',
];

// 过滤掉与目标公司无关的文章
export function filterIrrelevantArticles(articles: RawArticle[]): RawArticle[] {
  return articles.filter(article => {
    const text = `${article.title} ${article.snippet} ${article.content}`;
    return ENTITY_KEYWORDS.some(kw => text.includes(kw));
  });
}

// 获取当前日期（北京时间）
export function getBeijingDate(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Shanghai' });
}

// 获取北京时间 ISO 字符串
export function getBeijingTime(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' });
}

export { cheerio, HEADERS };
