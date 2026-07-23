import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReportStore } from '@/store/reportStore';
import Header from '@/components/Header';
import ReportView from '@/components/ReportView';
import SkeletonLoader from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';
import { Search, RefreshCw, Radar } from 'lucide-react';

export default function Home() {
  const location = useLocation();
  const { todayReport, loadingToday, todayError, refreshing, fetchTodayReport, refreshReport } = useReportStore();

  useEffect(() => {
    fetchTodayReport();
  }, [fetchTodayReport]);

  return (
    <div className="min-h-screen pb-8">
      <Header
        currentPath={location.pathname}
        onRefresh={refreshReport}
        refreshing={refreshing}
      />

      <main className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">


        {loadingToday && <SkeletonLoader />}

        {!loadingToday && todayError && !todayReport && (
          <div className="pt-10">
            <EmptyState
              icon={<Search className="h-16 w-16 text-neutral" />}
              title="今日报告尚未生成"
              description={todayError + '。系统每日北京时间 12:00 自动更新，您也可以点击下方按钮手动触发。'}
              action={
                <button
                  onClick={refreshReport}
                  disabled={refreshing}
                  className="flex items-center gap-2 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5 px-6 py-2.5 text-sm font-medium text-accent-cyan transition-colors hover:bg-accent-cyan/10 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? '正在生成报告...' : '立即生成报告'}
                </button>
              }
            />
          </div>
        )}

        {!loadingToday && todayReport && (
          <ReportView report={todayReport} />
        )}

        {!loadingToday && !todayError && !todayReport && (
          <div className="pt-10">
            <EmptyState
              icon={<Radar className="h-16 w-16 text-neutral" />}
              title="暂无报告数据"
              description="系统每日北京时间 12:00 自动更新，您也可以手动触发报告生成。"
              action={
                <button
                  onClick={refreshReport}
                  disabled={refreshing}
                  className="flex items-center gap-2 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5 px-6 py-2.5 text-sm font-medium text-accent-cyan transition-colors hover:bg-accent-cyan/10 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? '正在生成报告...' : '立即生成报告'}
                </button>
              }
            />
          </div>
        )}
      </main>
    </div>
  );
}
