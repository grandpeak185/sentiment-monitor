import { Link } from 'react-router-dom';
import { RefreshCw, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  currentPath: string;
  onRefresh: () => void;
  refreshing: boolean;
}

// 导航项配置
const navItems = [
  { label: '今日报告', path: '/' },
  { label: '历史报告', path: '/history' },
];

export default function Header({ currentPath, onRefresh, refreshing }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-accent-cyan/10 bg-base-900/80 backdrop-blur-xl scan-line">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 左侧：系统名称与监控状态 */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-blue/10 border border-accent-cyan/20">
            <Activity className="h-5 w-5 text-accent-cyan" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-display text-lg font-bold text-gradient-flow sm:text-xl">
              舆情监控中心
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-positive pulse-dot" />
              <p className="hidden text-xs text-neutral sm:block">
                海南中远海运集装箱运输有限公司
              </p>
            </div>
          </div>
        </div>

        {/* 右侧：导航与刷新按钮 */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-all sm:px-4',
                  currentPath === item.path
                    ? 'bg-accent-cyan/10 text-accent-cyan shadow-[0_0_12px_rgba(0,212,255,0.15)]'
                    : 'text-neutral-light hover:text-white hover:bg-white/5',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 立即刷新按钮 */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-lg border border-accent-cyan/30 bg-gradient-to-r from-accent-cyan/10 to-accent-blue/5 px-3 py-1.5 text-sm font-medium text-accent-cyan transition-all hover:from-accent-cyan/20 hover:to-accent-blue/10 hover:shadow-[0_0_16px_rgba(0,212,255,0.2)] disabled:opacity-50 sm:px-4"
          >
            <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
            <span className="hidden sm:inline">立即刷新</span>
          </button>
        </div>
      </div>
    </header>
  );
}
