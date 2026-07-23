import { useEffect, useRef } from 'react';
import type { Rating } from '@/types';

interface ScoreGaugeProps {
  score: number;
  rating: Rating;
  analysis: string;
}

// 半圆弧线长度（半径 90 的半圆 ≈ 283）
const ARC_LENGTH = 283;

// 根据分数获取弧线颜色
function getScoreColor(score: number): string {
  if (score >= 80) return '#FF4757'; // positive
  if (score >= 60) return '#00D4FF'; // accent-cyan
  if (score >= 40) return '#3B82F6'; // accent-blue
  return '#2ED573'; // negative
}

// 评级配置
const ratingConfig: Record<Rating, { label: string; color: string }> = {
  excellent: { label: '优', color: 'text-positive' },
  good: { label: '良', color: 'text-accent-cyan' },
  fair: { label: '中', color: 'text-accent-blue' },
  poor: { label: '差', color: 'text-negative' },
};

export default function ScoreGauge({ score, rating, analysis }: ScoreGaugeProps) {
  const arcRef = useRef<SVGPathElement>(null);
  const isMounted = useRef(false);
  const scoreColor = getScoreColor(score);
  const ratingInfo = ratingConfig[rating];
  const targetOffset = ARC_LENGTH * (1 - score / 100);

  useEffect(() => {
    const arc = arcRef.current;
    if (!arc) return;
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    arc.classList.remove('animate-gauge-fill');
    void arc.getBoundingClientRect();
    arc.classList.add('animate-gauge-fill');
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* 外圈装饰光晕 */}
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ backgroundColor: scoreColor, opacity: 0.1 }}
        />
        <svg width="220" height="120" viewBox="0 0 200 110" className="relative z-10">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={scoreColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={scoreColor} stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* 背景弧线 */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="#1E3350"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* 得分弧线 */}
          <path
            ref={arcRef}
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            style={{ strokeDashoffset: targetOffset }}
            className="animate-gauge-fill"
          />
        </svg>
        {/* 中心数字 */}
        <div className="absolute inset-x-0 top-6 flex flex-col items-center">
          <span
            className="font-display text-6xl font-bold leading-none"
            style={{
              color: scoreColor,
              textShadow: `0 0 10px ${scoreColor}, 0 0 20px ${scoreColor}, 0 0 40px ${scoreColor}40`
            }}
          >
            {score}
          </span>
          <span
            className="mt-2 font-display text-lg font-bold"
            style={{
              color: scoreColor,
              textShadow: `0 0 8px ${scoreColor}, 0 0 15px ${scoreColor}`
            }}
          >
            {ratingInfo.label}
          </span>
        </div>
      </div>
      {/* 综合分析 */}
      <p className="mt-6 max-w-2xl text-center text-sm leading-relaxed text-neutral-light">
        {analysis}
      </p>
    </div>
  );
}
