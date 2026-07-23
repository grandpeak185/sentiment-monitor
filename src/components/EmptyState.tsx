import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* 大图标 */}
      {icon && <div className="mb-4 text-neutral">{icon}</div>}
      {/* 标题 */}
      <h3 className="mb-2 font-display text-lg text-neutral-light">{title}</h3>
      {/* 描述 */}
      <p className="mb-6 max-w-sm text-sm text-neutral">{description}</p>
      {/* 可选按钮 */}
      {action}
    </div>
  );
}
