import { Sparkles, ExternalLink } from 'lucide-react';
import type { Article, SourceType, Sentiment } from '@/types';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  summary: string;
  keyPoints: string[];
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

export default function SummaryCard({ summary, keyPoints, articles }: SummaryCardProps) {
  return (
    <div className="glass-card relative overflow-hidden p-5 sm:p-6">
      {/* 左侧装饰竖线 - 渐变 */}
      <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent-cyan via-accent-blue to-accent-purple" />

      {/* 右上角装饰光晕 */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent-cyan/5 blur-2xl" />

      {/* 标题 */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-cyan/10">
          <Sparkles className="h-4 w-4 text-accent-cyan" />
        </div>
        <h3 className="font-display text-sm font-medium text-neon-cyan">AI 综合摘要</h3>
      </div>

      {/* 摘要正文 */}
      <p className="mb-4 text-sm leading-relaxed text-neutral-light">{summary}</p>

      {/* 关键信息标签 */}
      {keyPoints.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {keyPoints.map((point, idx) => (
            <span
            key={idx}
            className="rounded-full border border-accent-cyan/20 bg-gradient-to-r from-accent-cyan/5 to-accent-blue/5 px-3 py-1 text-xs font-medium text-gradient-cyan transition-all hover:scale-105 hover:border-accent-cyan/40"
          >
            {point}
          </span>
          ))}
        </div>
      )}

      {/* 信息摘要列表（可跳转） */}
      <div className="mt-6 border-t border-white/5 pt-4">
        <div className="mb-3 flex items-center gap-2">
          <h4 className="text-xs font-medium uppercase tracking-wider text-neutral">信息来源</h4>
          <span className="rounded-full bg-accent-cyan/10 px-2 py-0.5 text-xs text-accent-cyan">
            {articles.length}
          </span>
        </div>

        <div className="flex max-h-[400px] flex-col gap-2 overflow-y-auto pr-1">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-all hover:border-accent-cyan/20 hover:bg-white/[0.04]"
            >
              {/* 来源标签 */}
              <span className={cn('shrink-0 rounded border px-2 py-0.5 text-xs font-medium', sourceTypeStyles[article.sourceType])}>
                {sourceTypeLabels[article.sourceType]}
              </span>

              {/* 内容区 */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-neutral-light">
                    <span className={cn('h-1.5 w-1.5 rounded-full', sentimentDotStyles[article.sentiment])} />
                    {sentimentLabels[article.sentiment]}
                  </span>
                  {article.publishedDate && (
                    <span className="text-xs text-neutral">{article.publishedDate}</span>
                  )}
                </div>
                <h5 className="mb-1 line-clamp-2 text-sm font-medium text-white transition-colors group-hover:text-accent-cyan">
                  {article.title}
                </h5>
                <p className="line-clamp-2 text-xs text-neutral-light">{article.summary}</p>
              </div>

              {/* 跳转图标 */}
              <ExternalLink className="h-4 w-4 shrink-0 text-neutral opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-accent-cyan" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}