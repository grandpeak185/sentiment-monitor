import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReportStore } from '@/store/reportStore';
import Header from '@/components/Header';
import HistoryCard from '@/components/HistoryCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';
import { History as HistoryIcon, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const location = useLocation();
  const navigate = useNavigate();
  const { history, loadingHistory, historyError, fetchHistory } = useReportStore();

  useEffect(() => {
    fetchHistory(1, 50);
  }, [fetchHistory]);

  return (
    <div className="min-h-screen pb-8">
      <Header
        currentPath={location.pathname}
        onRefresh={() => fetchHistory(1, 50)}
        refreshing={loadingHistory}
      />

      <main className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <HistoryIcon className="h-6 w-6 text-accent-cyan" />
          <h2 className="font-display text-2xl font-bold text-gradient-cyan">历史报告</h2>
          {history && (
            <span className="rounded-full bg-accent-cyan/10 px-3 py-1 text-xs text-accent-cyan">
              共 {history.total} 份
            </span>
          )}
        </div>

        {loadingHistory && <SkeletonLoader />}

        {!loadingHistory && historyError && (
          <EmptyState
            icon={<HistoryIcon className="h-16 w-16 text-neutral" />}
            title="加载失败"
            description={historyError}
          />
        )}

        {!loadingHistory && !historyError && history && history.reports.length === 0 && (
          <EmptyState
            icon={<HistoryIcon className="h-16 w-16 text-neutral" />}
            title="暂无历史报告"
            description="系统运行后，每日报告将自动保存到历史记录中。"
          />
        )}

        {!loadingHistory && !historyError && history && history.reports.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            {history.reports.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onClick={() => navigate(`/history/${item.date}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
