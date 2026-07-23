import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AnalysisPanelProps {
  positiveScore: number;
  positiveAnalysis: string;
  neutralScore: number;
  neutralAnalysis: string;
  negativeScore: number;
  negativeAnalysis: string;
}

interface CardConfig {
  title: string;
  icon: typeof TrendingUp;
  color: string;
  scoreClass: string;
  titleClass: string;
  iconBg: string;
  iconColor: string;
  barGradient: string;
  glowClass: string;
  isNeutral: boolean;
}

// 卡片样式配置
const cardConfigs: Record<'positive' | 'neutral' | 'negative', CardConfig> = {
  positive: {
    title: '红方 · 正面',
    icon: TrendingUp,
    color: '#FF4757',
    scoreClass: 'text-3d-positive',
    titleClass: 'text-neon-positive',
    iconBg: 'bg-positive/10',
    iconColor: 'text-positive',
    barGradient: 'from-positive to-positive-light',
    glowClass: 'glow-positive',
    isNeutral: false,
  },
  neutral: {
    title: '黄方 · 中性',
    icon: Minus,
    color: '#FFD700',
    scoreClass: '',
    titleClass: '',
    iconBg: 'bg-yellow-400/10',
    iconColor: 'text-yellow-400',
    barGradient: 'from-yellow-400 to-yellow-300',
    glowClass: '',
    isNeutral: true,
  },
  negative: {
    title: '绿方 · 负面',
    icon: TrendingDown,
    color: '#2ED573',
    scoreClass: 'text-3d-negative',
    titleClass: 'text-neon-negative',
    iconBg: 'bg-negative/10',
    iconColor: 'text-negative',
    barGradient: 'from-negative to-negative-light',
    glowClass: 'glow-negative',
    isNeutral: false,
  },
};

function AnalysisCard({ config, score, analysis }: { config: CardConfig; score: number; analysis: string }) {
  const { icon: Icon, isNeutral } = config;

  // 黄方使用内联样式，其他用类名
  const scoreStyle = isNeutral ? {
    color: config.color,
    textShadow: '1px 1px 0 rgba(0,0,0,0.5), 2px 2px 0 rgba(255,215,0,0.3), 3px 3px 0 rgba(255,215,0,0.2), 4px 4px 0 rgba(255,215,0,0.1)',
  } : undefined;

  const titleStyle = isNeutral ? {
    color: config.color,
    textShadow: '0 0 5px rgba(255,215,0,0.5), 0 0 10px rgba(255,215,0,0.4), 0 0 20px rgba(255,215,0,0.3)',
  } : undefined;

  const glowStyle = isNeutral ? {
    boxShadow: '0 0 30px rgba(255, 215, 0, 0.15), inset 0 0 30px rgba(255, 215, 0, 0.03)',
  } : undefined;

  return (
    <div className={`glass-card relative flex h-full flex-col overflow-hidden p-5 ${config.glowClass}`} style={glowStyle}>
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" style={!isNeutral ? { background: `linear-gradient(135deg, ${config.color}08 0%, transparent 100%)` } : { background: 'linear-gradient(135deg, rgba(255,215,0,0.05) 0%, transparent 100%)' }} />
      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(to right, transparent, ${config.color}, transparent)` }} />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-3 flex items-center gap-2">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}>
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
          </div>
          <h3 className={`font-display ${config.titleClass}`} style={titleStyle}>
            {config.title}
          </h3>
        </div>

        <p className={`mb-4 font-display text-5xl font-bold ${config.scoreClass}`} style={scoreStyle}>
          {score}
        </p>

        <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-base-600">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${config.barGradient} transition-all duration-1000 ease-out`}
            style={{ width: `${score}%` }}
          />
        </div>

        <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-light">
          {analysis}
        </p>
      </div>
    </div>
  );
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch">
      <AnalysisCard config={cardConfigs.positive} score={positiveScore} analysis={positiveAnalysis} />
      <AnalysisCard config={cardConfigs.neutral} score={neutralScore} analysis={neutralAnalysis} />
      <AnalysisCard config={cardConfigs.negative} score={negativeScore} analysis={negativeAnalysis} />
    </div>
  );
}
