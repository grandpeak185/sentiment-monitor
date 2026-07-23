import { create } from 'zustand';
import type { Report, HistoryResponse } from '../types';

interface ReportStore {
  todayReport: Report | null;
  loadingToday: boolean;
  todayError: string | null;

  history: HistoryResponse | null;
  loadingHistory: boolean;
  historyError: string | null;

  dateReport: Report | null;
  loadingDate: boolean;
  dateError: string | null;

  refreshing: boolean;

  fetchTodayReport: () => Promise<void>;
  fetchHistory: (page?: number, limit?: number) => Promise<void>;
  fetchReportByDate: (date: string) => Promise<void>;
  refreshReport: () => Promise<boolean>;
}

export const useReportStore = create<ReportStore>((set) => ({
  todayReport: null,
  loadingToday: false,
  todayError: null,

  history: null,
  loadingHistory: false,
  historyError: null,

  dateReport: null,
  loadingDate: false,
  dateError: null,

  refreshing: false,

  fetchTodayReport: async () => {
    set({ loadingToday: true, todayError: null });
    try {
      const res = await fetch('./data/reports/latest.json');
      if (res.status === 404) {
        set({ todayReport: null, loadingToday: false, todayError: '今日报告尚未生成' });
        return;
      }
      if (!res.ok) throw new Error('获取报告失败');
      const data = await res.json();
      set({ todayReport: data, loadingToday: false });
    } catch (e) {
      set({ todayReport: null, loadingToday: false, todayError: e instanceof Error ? e.message : '未知错误' });
    }
  },

  fetchHistory: async () => {
    set({ loadingHistory: true, historyError: null });
    try {
      const res = await fetch('./data/reports/index.json');
      if (res.status === 404) {
        set({ history: { total: 0, page: 1, limit: 50, reports: [] }, loadingHistory: false });
        return;
      }
      if (!res.ok) throw new Error('获取历史报告失败');
      const data = await res.json();
      set({ history: data, loadingHistory: false });
    } catch (e) {
      set({ history: null, loadingHistory: false, historyError: e instanceof Error ? e.message : '未知错误' });
    }
  },

  fetchReportByDate: async (date: string) => {
    set({ loadingDate: true, dateError: null, dateReport: null });
    try {
      const res = await fetch(`./data/reports/${date}.json`);
      if (res.status === 404) {
        set({ dateReport: null, loadingDate: false, dateError: `${date} 的报告不存在` });
        return;
      }
      if (!res.ok) throw new Error('获取报告失败');
      const data = await res.json();
      set({ dateReport: data, loadingDate: false });
    } catch (e) {
      set({ dateReport: null, loadingDate: false, dateError: e instanceof Error ? e.message : '未知错误' });
    }
  },

  refreshReport: async () => {
    set({ refreshing: true });
    try {
      await useReportStore.getState().fetchTodayReport();
      set({ refreshing: false });
      return true;
    } catch {
      set({ refreshing: false });
      return false;
    }
  },
}));
