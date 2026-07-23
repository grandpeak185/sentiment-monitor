import type { HistoryItem, Rating } from '@/types';
import { cn } from '@/lib/utils';

interface HistoryCardProps {
  item: HistoryItem;
  onClick: () => void;
}

// 评级色块配置
const ratingConfig: Record<Rating, { label: string; dot: string; text: string }> = {
  excellent: { label: '优', dot: 'bg-positive', text: 'text-positive' },
  good: { label: '良', dot: 'bg-accent-cyan', text: 'text-accent-cyan' },
  fair: { label: '中', dot: 'bg-accent-blue', text: 'text-accent-blue' },
  poor: { label: '差', dot: 'bg-negative', text: 'text-negative' },
};

// 根据分数获取得分颜色
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-positive';
  if (score >= 60) return 'text-accent-cyan';
  if (score >= 40) return 'text-accent-blue';
  return 'text-negative';
}

export default function HistoryCard({ item, onClick }: HistoryCardProps) {
  const rating = ratingConfig[item.rating];

  return (
    <div
      onClick={onClick}
      className="glass-card flex cursor-pointer items-center gap-4 p-4 transition-colors hover:border-accent-cyan/30"
    >
      {/* 左侧：日期与评级 */}
      <div className="flex w-24 shrink-0 flex-col gap-2">
        <span className="font-display text-lg text-white">{item.date}</span>
        <span className="flex items-center gap-1.5">
          <span className={cn('h-2 w-2 rounded-full', rating.dot)} />
          <span className={cn('text-xs', rating.text)}>{rating.label}</span>
        </span>
      </div>

      {/* 中间：摘要预览 */}
      <p className="line-clamp-2 flex-1 text-sm text-neutral-light">{item.summary}</p>

      {/* 右侧：综合得分与文章数 */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className={cn('font-mono text-2xl font-bold', getScoreColor(item.overallScore))}>
          {item.overallScore}
        </span>
        <span className="text-xs text-neutral">{item.articleCount} 条</span>
      </div>
    </div>
  );
}
