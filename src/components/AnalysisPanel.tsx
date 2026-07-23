import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AnalysisPanelProps {
  positiveScore: number;
  positiveAnalysis: string;
  neutralScore: number;
  neutralAnalysis: string;
  negativeScore: number;
  negativeAnalysis: string;
}

export default function AnalysisPanel({
  positiveScore,
  positiveAnalysis,
  neutralScore,
  neutralAnalysis,
  negativeScore,
  negativeAnalysis,
}: AnalysisPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* 红方 - 正面 */}
      <div className="glass-card glow-positive relative overflow-hidden p-5">
        <div className="absolute inset-0 bg-gradient-to-br from-positive/5 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-positive to-transparent" />

        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-positive/10">
              <TrendingUp className="h-5 w-5 text-positive" />
            </div>
            <h3 className="font-display text-neon-positive">红方 · 正面</h3>
          </div>
          <p className="mb-4 font-display text-5xl font-bold text-3d-positive">{positiveScore}</p>
          <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-base-600">
            <div
              className="h-full rounded-full bg-gradient-to-r from-positive to-positive-light transition-all duration-1000 ease-out"
              style={{ width: `${positiveScore}%` }}
            />
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-light">
            {positiveAnalysis}
          </p>
        </div>
      </div>

      {/* 黄方 - 中性 */}
      <div className="glass-card relative overflow-hidden p-5" style={{ boxShadow: '0 0 30px rgba(255, 215, 0, 0.15), inset 0 0 30px rgba(255, 215, 0, 0.03)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400/10">
              <Minus className="h-5 w-5 text-yellow-400" />
            </div>
            <h3 className="font-display" style={{ color: '#FFD700', textShadow: '0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.3)' }}>
              黄方 · 中性
            </h3>
          </div>
          <p className="mb-4 font-display text-5xl font-bold" style={{ color: '#FFD700', textShadow: '1px 1px 0 rgba(0,0,0,0.5), 2px 2px 0 rgba(255,215,0,0.3), 3px 3px 0 rgba(255,215,0,0.2), 4px 4px 0 rgba(255,215,0,0.1)' }}>
            {neutralScore}
          </p>
          <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-base-600">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 transition-all duration-1000 ease-out"
              style={{ width: `${neutralScore}%` }}
            />
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-light">
            {neutralAnalysis}
          </p>
        </div>
      </div>

      {/* 绿方 - 负面 */}
      <div className="glass-card glow-negative relative overflow-hidden p-5">
        <div className="absolute inset-0 bg-gradient-to-br from-negative/5 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-negative to-transparent" />

        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-negative/10">
              <TrendingDown className="h-5 w-5 text-negative" />
            </div>
            <h3 className="font-display text-neon-negative">绿方 · 负面</h3>
          </div>
          <p className="mb-4 font-display text-5xl font-bold text-3d-negative">{negativeScore}</p>
          <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-base-600">
            <div
              className="h-full rounded-full bg-gradient-to-r from-negative to-negative-light transition-all duration-1000 ease-out"
              style={{ width: `${negativeScore}%` }}
            />
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-light">
            {negativeAnalysis}
          </p>
        </div>
      </div>
    </div>
  );
}
