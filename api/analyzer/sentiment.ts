import type { Sentiment } from '../types.js';

// 正面情感词典
const POSITIVE_WORDS: Record<string, number> = {
  '增长': 2, '提升': 2, '突破': 3, '创新': 3, '领先': 3, '成功': 3, '合作': 2,
  '签约': 2, '开通': 2, '盈利': 3, '丰收': 2, '优化': 2, '升级': 2, '拓展': 2,
  '荣誉': 3, '获奖': 3, '认可': 2, '表彰': 2, '优秀': 3, '卓越': 3, '高效': 2,
  '稳定': 2, '安全': 2, '便捷': 2, '智能': 2, '绿色': 2, '环保': 2, '节能': 2,
  '减排': 2, '碳中和': 3, '可持续发展': 3, '新航线': 3, '新业务': 2, '新订单': 3,
  '首航': 3, '交付': 2, '启航': 2, '投产': 2, '运营': 1, '发展': 2, '繁荣': 3,
  '强劲': 3, '复苏': 2, '回暖': 2, '向好': 2, '利好': 3, '机遇': 2, '前景': 2,
  '信心': 2, '积极': 2, '稳健': 2, '亮丽': 2, '佳绩': 3, '里程碑': 3, '战略': 2,
  '协同': 2, '赋能': 2, '数字化转型': 3, '智能化': 2, '自动化': 2, '数字化': 2,
  '最大化': 2, '最优化': 2, '增值': 2, '增效': 2, '降本': 2, '提质': 2,
  '圆满': 3, '顺利': 2, '高效完成': 3, '超预期': 3, '创历史': 3, '创新高': 3,
  '新高': 2, '记录': 1, '扩大': 2, '增加': 2, '上升': 2, '改善': 2, '加强': 2,
  '推进': 1, '落实': 1, '实施': 1, '启动': 2, '开展': 1, '签署': 2, '达成': 2,
  '联合': 1, '携手': 2, '共建': 2, '共赢': 3, '互利': 2, '良好': 2, '出色': 3,
};

// 负面情感词典
const NEGATIVE_WORDS: Record<string, number> = {
  '亏损': 3, '下降': 2, '下滑': 2, '暴跌': 3, '下跌': 2, '减少': 2, '萎缩': 3,
  '违约': 3, '违规': 3, '处罚': 3, '罚款': 3, '立案': 3, '调查': 2, '投诉': 2,
  '事故': 3, '故障': 2, '延误': 2, '停运': 3, '停航': 3, '取消': 2, '中断': 2,
  '拥堵': 2, '滞留': 2, '短缺': 2, '危机': 3, '风险': 2, '隐患': 2, '漏洞': 2,
  '污染': 3, '泄漏': 3, '超标': 2, '违规排放': 3, '环境违法': 3,
  '裁员': 3, '罢工': 3, '纠纷': 2, '诉讼': 3, '败诉': 3, '赔偿': 2,
  '退市': 3, '破产': 3, '倒闭': 3, '重组': 2, '动荡': 2, '不稳定': 2,
  '低迷': 2, '疲软': 2, '恶化': 3, '衰退': 3, '萧条': 3, '困难': 2,
  '挑战': 1, '压力': 1, '问题': 1, '障碍': 2, '瓶颈': 2,
  '质疑': 2, '批评': 2, '谴责': 3, '抗议': 3, '反对': 2, '不满': 2,
  '失望': 2, '担忧': 2, '悲观': 2, '负面': 2, '不利': 2, '受损': 2,
  '失败': 3, '失误': 2, '错误': 2, '缺陷': 2, '不足': 1, '缺乏': 1,
  '逾期': 2, '拖欠': 2, '坏账': 3, '债务': 1, '负债': 1, '抵押': 1,
  '滞期': 2, '甩柜': 2, '爆舱': 2, '缺柜': 2, '运价下跌': 3, '运力过剩': 2,
  '产能过剩': 2, '竞争加剧': 2, '价格战': 2, '补贴退坡': 2, '政策收紧': 2,
  '贸易战': 3, '制裁': 3, '禁运': 3, '关税': 1, '壁垒': 2,
};

// 否定词
const NEGATION_WORDS = ['不', '没', '未', '无', '非', '莫', '勿', '别', '毫无', '并非', '没有', '未能'];

// 程度副词（加权）
const DEGREE_WORDS: Record<string, number> = {
  '非常': 1.5, '极其': 2.0, '特别': 1.5, '十分': 1.5, '格外': 1.5,
  '尤为': 1.5, '相当': 1.3, '比较': 1.2, '较为': 1.2, '稍微': 0.5,
  '略微': 0.5, '进一步': 1.3, '大幅': 1.8, '大幅度': 1.8, '显著': 1.5,
  '明显': 1.3, '持续': 1.2, '连续': 1.2, '大幅增长': 2.0, '大幅下降': 2.0,
};

export interface SentimentResult {
  sentiment: Sentiment;
  score: number; // 0-1, >0.5 偏正面, <0.5 偏负面
  positiveScore: number;
  negativeScore: number;
  matchedPositive: string[];
  matchedNegative: string[];
}

export function analyzeSentiment(text: string): SentimentResult {
  let positiveScore = 0;
  let negativeScore = 0;
  const matchedPositive: string[] = [];
  const matchedNegative: string[] = [];

  // 检查正面词
  for (const [word, weight] of Object.entries(POSITIVE_WORDS)) {
    let idx = text.indexOf(word);
    while (idx !== -1) {
      let effectiveWeight = weight;
      // 检查前面是否有否定词或程度副词
      const prefix = text.substring(Math.max(0, idx - 6), idx);
      for (const neg of NEGATION_WORDS) {
        if (prefix.includes(neg)) {
          effectiveWeight = -weight; // 否定反转
          break;
        }
      }
      if (effectiveWeight > 0) {
        for (const [deg, mult] of Object.entries(DEGREE_WORDS)) {
          if (prefix.includes(deg)) {
            effectiveWeight *= mult;
            break;
          }
        }
      }
      if (effectiveWeight > 0) {
        positiveScore += effectiveWeight;
        if (!matchedPositive.includes(word)) matchedPositive.push(word);
      } else {
        negativeScore += Math.abs(effectiveWeight);
        if (!matchedNegative.includes(word)) matchedNegative.push(word);
      }
      idx = text.indexOf(word, idx + word.length);
    }
  }

  // 检查负面词
  for (const [word, weight] of Object.entries(NEGATIVE_WORDS)) {
    let idx = text.indexOf(word);
    while (idx !== -1) {
      let effectiveWeight = weight;
      const prefix = text.substring(Math.max(0, idx - 6), idx);
      for (const neg of NEGATION_WORDS) {
        if (prefix.includes(neg)) {
          effectiveWeight = -weight;
          break;
        }
      }
      if (effectiveWeight > 0) {
        for (const [deg, mult] of Object.entries(DEGREE_WORDS)) {
          if (prefix.includes(deg)) {
            effectiveWeight *= mult;
            break;
          }
        }
      }
      if (effectiveWeight > 0) {
        negativeScore += effectiveWeight;
        if (!matchedNegative.includes(word)) matchedNegative.push(word);
      } else {
        positiveScore += Math.abs(effectiveWeight);
        if (!matchedPositive.includes(word)) matchedPositive.push(word);
      }
      idx = text.indexOf(word, idx + word.length);
    }
  }

  const total = positiveScore + negativeScore;
  let score: number;
  let sentiment: Sentiment;

  if (total === 0) {
    score = 0.5;
    sentiment = 'neutral';
  } else {
    score = positiveScore / total;
    if (score > 0.6) {
      sentiment = 'positive';
    } else if (score < 0.4) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }
  }

  return {
    sentiment,
    score: Math.round(score * 100) / 100,
    positiveScore: Math.round(positiveScore * 100) / 100,
    negativeScore: Math.round(negativeScore * 100) / 100,
    matchedPositive,
    matchedNegative,
  };
}
