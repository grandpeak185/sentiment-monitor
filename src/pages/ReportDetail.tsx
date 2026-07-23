import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useReportStore } from '@/store/reportStore';
import Header from '@/components/Header';
import ReportView from '@/components/ReportView';
import SkeletonLoader from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';
import { ChevronLeft, FileQuestion } from 'lucide-react';

export default function ReportDetail() {
  const { date } = useParams<{ date: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { dateReport, loadingDate, dateError, fetchReportByDate } = useReportStore();

  useEffect(() => {
    if (date) {
      fetchReportByDate(date);
    }
  }, [date, fetchReportByDate]);

  return (
    <div className="min-h-screen pb-8">
      <Header
        currentPath="/history"
        onRefresh={() => date && fetchReportByDate(date)}
        refreshing={loadingDate}
      />

      <main className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/history')}
          className="mb-6 flex items-center gap-1.5 text-sm text-neutral-light transition-colors hover:text-accent-cyan"
        >
          <ChevronLeft className="h-4 w-4" />
          返回历史列表
        </button>

        {loadingDate && <SkeletonLoader />}

        {!loadingDate && dateError && (
          <EmptyState
            icon={<FileQuestion className="h-16 w-16 text-neutral" />}
            title="报告不存在"
            description={dateError}
          />
        )}

        {!loadingDate && !dateError && dateReport && (
          <ReportView report={dateReport} />
        )}
      </main>
    </div>
  );
}
