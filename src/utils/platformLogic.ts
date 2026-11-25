export type RankId = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface RankInfo {
  id: RankId;
  name: string;
  emoji: string;
  feePercent: number;
  requirementLabel: string;
  nextPointsTarget: number | null;
}

export function calculateMemberRank(trustPoints: number, cleanWithdrawals: number): RankInfo {
  if (trustPoints >= 1500) {
    return {
      id: 'diamond',
      name: 'ماسي',
      emoji: '💎',
      feePercent: 2,
      requirementLabel: 'من 1,500 نقطة',
      nextPointsTarget: null,
    };
  }
  if (trustPoints >= 600 && cleanWithdrawals >= 4) {
    return {
      id: 'gold',
      name: 'ذهبي',
      emoji: '🥇',
      feePercent: 3,
      requirementLabel: 'من 600 نقطة + 4 سحوبات نظيفة متتالية',
      nextPointsTarget: 1500,
    };
  }
  if (trustPoints >= 200 && cleanWithdrawals >= 2) {
    return {
      id: 'silver',
      name: 'فضي',
      emoji: '🥈',
      feePercent: 4,
      requirementLabel: 'من 200 نقطة + سحبتين نظيفتين متتاليتين',
      nextPointsTarget: 600,
    };
  }
  return {
    id: 'bronze',
    name: 'برونزي',
    emoji: '🥉',
    feePercent: 5,
    requirementLabel: 'حتى 199 نقطة',
    nextPointsTarget: 200,
  };
}

export function calculateNetReward(grossReward: number, feePercent: number): number {
  const safeGross = Math.max(0, grossReward);
  const safeFee = Math.min(100, Math.max(0, feePercent));
  return Number((safeGross * (1 - safeFee / 100)).toFixed(4));
}

export type ServiceId =
  | 'follow'
  | 'like'
  | 'comment'
  | 'yt_subscribe'
  | 'yt_comment'
  | 'ig_follow'
  | 'ig_like'
  | 'twitter_follow'
  | 'twitter_retweet'
  | 'twitter_reply';

export interface ServiceDefinition {
  id: ServiceId;
  platform: 'tiktok' | 'youtube' | 'instagram' | 'twitter';
  platformLabel: string;
  label: string;
  actionLabel: string;
  unitCost: number;
  workerReward: number;
  minQuantity: number;
  maxQuantity: number;
  supportsGuarantee: boolean;
  urlPlaceholder: string;
}

export const CAMPAIGN_SERVICES: Record<ServiceId, ServiceDefinition> = {
  follow: {
    id: 'follow',
    platform: 'tiktok',
    platformLabel: 'تيك توك',
    label: 'متابعات تيك توك',
    actionLabel: 'متابعات',
    unitCost: 0.015,
    workerReward: 0.01,
    minQuantity: 20,
    maxQuantity: 10000,
    supportsGuarantee: true,
    urlPlaceholder: 'https://www.tiktok.com/@username',
  },
  like: {
    id: 'like',
    platform: 'tiktok',
    platformLabel: 'تيك توك',
    label: 'إعجابات تيك توك',
    actionLabel: 'إعجابات',
    unitCost: 0.009,
    workerReward: 0.006,
    minQuantity: 20,
    maxQuantity: 20000,
    supportsGuarantee: false,
    urlPlaceholder: 'https://www.tiktok.com/@username/video/123456',
  },
  comment: {
    id: 'comment',
    platform: 'tiktok',
    platformLabel: 'تيك توك',
    label: 'تعليقات تيك توك',
    actionLabel: 'تعليقات',
    unitCost: 0.025,
    workerReward: 0.016,
    minQuantity: 10,
    maxQuantity: 2000,
    supportsGuarantee: false,
    urlPlaceholder: 'https://www.tiktok.com/@username/video/123456',
  },
  yt_subscribe: {
    id: 'yt_subscribe',
    platform: 'youtube',
    platformLabel: 'يوتيوب',
    label: 'اشتراكات يوتيوب',
    actionLabel: 'اشتراكات',
    unitCost: 0.03,
    workerReward: 0.02,
    minQuantity: 15,
    maxQuantity: 5000,
    supportsGuarantee: true,
    urlPlaceholder: 'https://www.youtube.com/@channel',
  },
  yt_comment: {
    id: 'yt_comment',
    platform: 'youtube',
    platformLabel: 'يوتيوب',
    label: 'تعليقات يوتيوب',
    actionLabel: 'تعليقات',
    unitCost: 0.032,
    workerReward: 0.021,
    minQuantity: 10,
    maxQuantity: 2000,
    supportsGuarantee: false,
    urlPlaceholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  ig_follow: {
    id: 'ig_follow',
    platform: 'instagram',
    platformLabel: 'إنستجرام',
    label: 'متابعات إنستجرام',
    actionLabel: 'متابعات',
    unitCost: 0.018,
    workerReward: 0.012,
    minQuantity: 20,
    maxQuantity: 10000,
    supportsGuarantee: true,
    urlPlaceholder: 'https://www.instagram.com/username',
  },
  ig_like: {
    id: 'ig_like',
    platform: 'instagram',
    platformLabel: 'إنستجرام',
    label: 'إعجابات إنستجرام',
    actionLabel: 'إعجابات',
    unitCost: 0.01,
    workerReward: 0.0065,
    minQuantity: 20,
    maxQuantity: 20000,
    supportsGuarantee: false,
    urlPlaceholder: 'https://www.instagram.com/p/POSTID/',
  },
  twitter_follow: {
    id: 'twitter_follow',
    platform: 'twitter',
    platformLabel: 'X',
    label: 'متابعات X',
    actionLabel: 'متابعات',
    unitCost: 0.02,
    workerReward: 0.013,
    minQuantity: 20,
    maxQuantity: 5000,
    supportsGuarantee: true,
    urlPlaceholder: 'https://x.com/username',
  },
  twitter_retweet: {
    id: 'twitter_retweet',
    platform: 'twitter',
    platformLabel: 'X',
    label: 'إعادة نشر X',
    actionLabel: 'إعادة نشر',
    unitCost: 0.016,
    workerReward: 0.01,
    minQuantity: 15,
    maxQuantity: 5000,
    supportsGuarantee: false,
    urlPlaceholder: 'https://x.com/username/status/123456',
  },
  twitter_reply: {
    id: 'twitter_reply',
    platform: 'twitter',
    platformLabel: 'X',
    label: 'تعليقات X',
    actionLabel: 'تعليقات',
    unitCost: 0.026,
    workerReward: 0.017,
    minQuantity: 10,
    maxQuantity: 2000,
    supportsGuarantee: false,
    urlPlaceholder: 'https://x.com/username/status/123456',
  },
};

export function calculateCampaignCost(params: {
  service: ServiceId;
  quantity: number;
  withGuarantee: boolean;
}) {
  const def = CAMPAIGN_SERVICES[params.service];
  const qty = Math.max(0, Math.floor(params.quantity));
  const subtotal = Number((qty * def.unitCost).toFixed(2));
  const guaranteeCost =
    params.withGuarantee && def.supportsGuarantee ? Number((subtotal * 0.2).toFixed(2)) : 0;
  const total = Number((subtotal + guaranteeCost).toFixed(2));
  return {
    unitCost: def.unitCost,
    workerReward: def.workerReward,
    subtotal,
    guaranteeCost,
    total,
  };
}

export function calculateCampaignRefund(params: {
  totalBudget: number;
  completedCount: number;
  targetQuantity: number;
}): number {
  if (params.targetQuantity <= 0 || params.totalBudget <= 0) return 0;
  const clampedCompleted = Math.min(params.targetQuantity, Math.max(0, params.completedCount));
  const remainingRatio = (params.targetQuantity - clampedCompleted) / params.targetQuantity;
  return Number((params.totalBudget * remainingRatio).toFixed(2));
}

export function calculatePartnerProfit(params: {
  monthlyVolume: number;
  marginPercent: number;
  monthlyOrders: number;
}) {
  const volume = Math.max(0, params.monthlyVolume);
  const margin = Math.max(0, Math.min(50, params.marginPercent));
  const orders = Math.max(1, Math.floor(params.monthlyOrders));
  const monthlyProfit = Number(((volume * margin) / 100).toFixed(2));
  const avgPerOrder = Number((monthlyProfit / orders).toFixed(2));
  const annualEstimate = Number((monthlyProfit * 12).toFixed(2));
  return { monthlyProfit, avgPerOrder, annualEstimate };
}

export interface PasswordValidation {
  minLength: boolean;
  hasEnglishLetter: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
  isValid: boolean;
}

export function validatePassword(password: string): PasswordValidation {
  const minLength = password.length >= 8;
  const hasEnglishLetter = /[A-Za-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9\s]/.test(password);
  return {
    minLength,
    hasEnglishLetter,
    hasDigit,
    hasSymbol,
    isValid: minLength && hasEnglishLetter && hasDigit && hasSymbol,
  };
}

export interface FaqItem {
  id: string;
  category: 'account' | 'earnings' | 'campaigns';
  question: string;
  answer: string;
}

export function filterFaqs(
  faqs: FaqItem[],
  category: 'all' | 'account' | 'earnings' | 'campaigns',
  query: string
): FaqItem[] {
  const normalized = query.trim().toLowerCase();
  return faqs.filter((item) => {
    const matchesCat = category === 'all' || item.category === category;
    if (!matchesCat) return false;
    if (!normalized) return true;
    return (
      item.question.toLowerCase().includes(normalized) ||
      item.answer.toLowerCase().includes(normalized)
    );
  });
}

export interface DirectoryEntry {
  title: string;
  subtitle: string;
  path: string;
  keywords: string;
}

export function searchSiteDirectory(entries: DirectoryEntry[], query: string): DirectoryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries.slice(0, 8);
  return entries
    .filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.subtitle.toLowerCase().includes(q) ||
        e.keywords.toLowerCase().includes(q)
    )
    .slice(0, 8);
}

export function formatUsd(amount: number, decimals = 2): string {
  return `$${amount.toFixed(decimals)}`;
}
