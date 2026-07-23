import { ExternalLink } from 'lucide-react';
import type { Article, SourceType, Sentiment } from '@/types';
import { cn } from '@/lib/utils';

interface NewsListProps {
  articles: Article[];
}

// 来源类型样式映射
const sourceTypeStyles: Record<SourceType, string> = {
  news: 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
  wechat: 'bg-positive/15 text-positive border-positive/20',
  weibo: 'bg-accent-purple/15 text-accent-purple border-accent-purple/20',
  industry: 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/20',
};

const sourceTypeLabels: Record<SourceType, string> = {
  news: '新闻',
  wechat: '微信',
  weibo: '微博',
  industry: '行业',
};

// 情感指示灯颜色
const sentimentDotStyles: Record<Sentiment, string> = {
  positive: 'bg-positive',
  negative: 'bg-negative',
  neutral: 'bg-neutral',
};

const sentimentLabels: Record<Sentiment, string> = {
  positive: '正面',
  negative: '负面',
  neutral: '中性',
};

export default function NewsList({ articles }: NewsListProps) {
  return (
    <section className="flex flex-col">
      {/* 标题 */}
      <div className="mb-3 flex items-center gap-2">
        <h3 className="font-display text-sm font-medium text-accent-cyan">信息列表</h3>
        <span className="rounded-full bg-accent-cyan/10 px-2 py-0.5 text-xs font-medium text-accent-cyan">
          {articles.length}
        </span>
      </div>

      {/* 文章列表 */}
      <div className="flex max-h-[600px] flex-col gap-3 overflow-y-auto pr-1">
        {articles.map((article) => (
          <article
            key={article.id}
            className="glass-card group p-4 transition-all hover:translate-x-1"
          >
            {/* 顶部行：来源标签 + 情感指示灯 + 发布时间 */}
            <div className="mb-2 flex items-center gap-2">
              <span className={cn('rounded border px-2 py-0.5 text-xs font-medium', sourceTypeStyles[article.sourceType])}>
                {sourceTypeLabels[article.sourceType]}
              </span>
              <span className="flex items-center gap-1 text-xs text-neutral-light">
                <span className={cn('h-2 w-2 rounded-full', sentimentDotStyles[article.sentiment])} />
                {sentimentLabels[article.sentiment]}
              </span>
              <span className="ml-auto text-xs text-neutral">{article.publishedDate}</span>
            </div>

            {/* 标题 */}
            <h4 className="mb-1 font-medium text-white transition-colors group-hover:text-accent-cyan">
              {article.title}
            </h4>

            {/* 摘要 */}
            <p className="mb-3 line-clamp-2 text-sm text-neutral-light">{article.summary}</p>

            {/* 关键信息标签 */}
            {article.keyPoints.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {article.keyPoints.map((point, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-neutral"
                  >
                    {point}
                  </span>
                ))}
              </div>
            )}

            {/* 查看原文 */}
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-accent-cyan hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              查看原文
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
