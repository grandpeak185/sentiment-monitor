import type { Report } from '@/types';
import StatusBar from './StatusBar';
import SummaryCard from './SummaryCard';
import AnalysisPanel from './AnalysisPanel';
import ScoreGauge from './ScoreGauge';

// 报告视图 - 组合所有报告组件
interface ReportViewProps {
  report: Report;
}

export default function ReportView({ report }: ReportViewProps) {
  return (
    <div className="animate-fade-in space-y-6">
      {/* 状态栏 */}
      <StatusBar
        date={report.date}
        updatedAt={report.updatedAt}
      />

      {/* AI 综合摘要 */}
      <SummaryCard summary={report.summary} keyPoints={report.keyPoints} articles={report.articles} />

      {/* 分析面板 */}
      <AnalysisPanel
        positiveScore={report.positiveScore}
        positiveAnalysis={report.positiveAnalysis}
        neutralScore={report.neutralScore}
        neutralAnalysis={report.neutralAnalysis}
        negativeScore={report.negativeScore}
        negativeAnalysis={report.negativeAnalysis}
      />

      {/* 综合评分 */}
      <div className="gradient-border relative overflow-hidden p-8 glow-cyan">
        {/* 装饰光晕 */}
        <div className="absolute -left-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-accent-cyan/5 blur-3xl" />
        <div className="absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-accent-purple/5 blur-3xl" />

        <h3 className="mb-6 text-center font-display text-sm font-bold uppercase tracking-wider text-accent-cyan">
          综合评分
        </h3>
        <ScoreGauge
          score={report.overallScore}
          rating={report.rating}
          analysis={report.overallAnalysis}
        />
      </div>
    </div>
  );
}
