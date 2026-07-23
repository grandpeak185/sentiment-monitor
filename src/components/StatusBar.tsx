import { Calendar, Clock } from 'lucide-react';

interface StatusBarProps {
  date: string;
  updatedAt: string;
}

// 提取时间部分（HH:MM:SS）
function getTimeOnly(dateTime: string): string {
  const timePart = dateTime.split(' ')[1] ?? dateTime.split('T')[1] ?? dateTime;
  return timePart.slice(0, 8);
}

export default function StatusBar({ date, updatedAt }: StatusBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-cyan/10">
          <Calendar className="h-4 w-4 text-accent-cyan" />
        </div>
        <div>
          <p className="text-xs text-neutral">报告日期</p>
          <p className="font-mono text-lg font-bold text-neon-cyan">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-blue/10">
          <Clock className="h-4 w-4 text-accent-blue" />
        </div>
        <div>
          <p className="text-xs text-neutral">更新时间</p>
          <p className="font-mono text-lg font-bold text-neon-purple">{getTimeOnly(updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}
