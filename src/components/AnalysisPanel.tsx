import { TrendingUp, TrendingDown } from 'lucide-react';

interface AnalysisPanelProps {
  positiveScore: number;
  positiveAnalysis: string;
  negativeScore: number;
  negativeAnalysis: string;
}

export default function AnalysisPanel({
  positiveScore,
  positiveAnalysis,
  negativeScore,
  negativeAnalysis,
}: AnalysisPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* 红方 - 正面分析 */}
      <div className="glass-card glow-positive relative overflow-hidden p-5">
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-positive/5 to-transparent" />
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-positive to-transparent" />

        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-positive/10">
              <TrendingUp className="h-5 w-5 text-positive" />
            </div>
            <h3 className="font-display text-neon-positive">红方 · 正面分析</h3>
          </div>
          {/* 大数字得分 */}
          <p className="mb-4 font-display text-5xl font-bold text-3d-positive">{positiveScore}</p>
          {/* 得分条 */}
          <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-base-600">
            <div
              className="h-full rounded-full bg-gradient-to-r from-positive to-positive-light transition-all duration-1000 ease-out"
              style={{ width: `${positiveScore}%` }}
            />
          </div>
          {/* 分析正文 */}
          <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-light">
            {positiveAnalysis}
          </p>
        </div>
      </div>

      {/* 绿方 - 负面分析 */}
      <div className="glass-card glow-negative relative overflow-hidden p-5">
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-negative/5 to-transparent" />
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-negative to-transparent" />

        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-negative/10">
              <TrendingDown className="h-5 w-5 text-negative" />
            </div>
            <h3 className="font-display text-neon-negative">绿方 · 负面分析</h3>
          </div>
          {/* 大数字得分 */}
          <p className="mb-4 font-display text-5xl font-bold text-3d-negative">{negativeScore}</p>
          {/* 得分条 */}
          <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-base-600">
            <div
              className="h-full rounded-full bg-gradient-to-r from-negative to-negative-light transition-all duration-1000 ease-out"
              style={{ width: `${negativeScore}%` }}
            />
          </div>
          {/* 分析正文 */}
          <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-light">
            {negativeAnalysis}
          </p>
        </div>
      </div>
    </div>
  );
}
