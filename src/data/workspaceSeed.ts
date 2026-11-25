import { ServiceId } from '../utils/platformLogic';

export interface SocialTask {
  id: string;
  platform: 'tiktok' | 'youtube' | 'instagram' | 'twitter';
  service: ServiceId;
  actionType: 'follow' | 'like' | 'comment' | 'subscribe' | 'retweet';
  actionLabel: string;
  handle: string;
  title: string;
  targetUrl: string;
  reward: number;
  remaining: number;
  pinned?: boolean;
  note?: string;
}

export interface LinkedAccount {
  id: string;
  platform: 'tiktok' | 'youtube' | 'instagram' | 'twitter';
  handle: string;
  followers: number;
  verified: boolean;
  active: boolean;
  addedAt: string;
}

export interface WalletTransaction {
  id: string;
  type: 'earn' | 'deposit' | 'withdraw' | 'campaign' | 'refund' | 'referral' | 'contest';
  title: string;
  amount: number; // positive = credit, negative = debit
  balanceType: 'available' | 'ad';
  date: string;
  status: 'مكتملة' | 'قيد المراجعة';
}

export interface CampaignRecord {
  id: string;
  service: ServiceId;
  platform: 'tiktok' | 'youtube' | 'instagram' | 'twitter';
  title: string;
  targetUrl: string;
  targetQuantity: number;
  completedCount: number;
  compensatedCount: number;
  totalBudget: number;
  withGuarantee: boolean;
  guaranteeUntil?: string;
  status: 'نشطة' | 'متوقفة مؤقتًا' | 'مكتملة' | 'ملغاة';
  createdAt: string;
}

export interface TrustedTrader {
  id: string;
  name: string;
  country: string;
  flag: string;
  methods: string[];
  rating: number;
  tradesCount: number;
  buyRate: string;
  sellRate: string;
  online: boolean;
  verified: boolean;
  minUsd: number;
  maxUsd: number;
}

export interface AuctionListing {
  id: string;
  referralCode: string;
  seller: string;
  tasksCompleted: number;
  monthlyEarnings: number;
  currentBid: number;
  minIncrement: number;
  bidsCount: number;
  endsIn: string;
  activeDays: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'مفتوحة' | 'تم الرد' | 'مغلقة';
  createdAt: string;
  messages: { sender: 'user' | 'support'; text: string; time: string }[];
}

export interface TraderChatThread {
  id: string;
  traderId: string;
  traderName: string;
  orderType: 'شحن رصيد' | 'بيع رصيد';
  amountUsd: number;
  method: string;
  status: 'بانتظار التحويل' | 'مكتملة' | 'مفتوحة';
  messages: { sender: 'user' | 'trader'; text: string; time: string }[];
}

export const INITIAL_TASKS: SocialTask[] = [
  {
    id: 'tsk-1',
    platform: 'tiktok',
    service: 'follow',
    actionType: 'follow',
    actionLabel: 'متابعة حساب',
    handle: '@ahmed.tech.eg',
    title: 'أحمد تك — مراجعات هواتف وتقنية',
    targetUrl: 'https://www.tiktok.com/@ahmed.tech.eg',
    reward: 0.012,
    remaining: 184,
    pinned: true,
    note: 'تابع الحساب من حسابك المرتبط ولا تلغِ المتابعة بعد التأكيد.',
  },
  {
    id: 'tsk-2',
    platform: 'tiktok',
    service: 'like',
    actionType: 'like',
    actionLabel: 'إعجاب بفيديو',
    handle: '@chef.mariam',
    title: 'وصفة مكرونة سريعة في 10 دقايق',
    targetUrl: 'https://www.tiktok.com/@chef.mariam',
    reward: 0.007,
    remaining: 420,
    note: 'شاهد 10 ثوانٍ على الأقل قبل وضع الإعجاب.',
  },
  {
    id: 'tsk-3',
    platform: 'tiktok',
    service: 'comment',
    actionType: 'comment',
    actionLabel: 'تعليق على فيديو',
    handle: '@cairo.vlogs',
    title: 'جولة مسائية في وسط البلد بالقاهرة',
    targetUrl: 'https://www.tiktok.com/@cairo.vlogs',
    reward: 0.018,
    remaining: 65,
    note: 'اكتب تعليقًا مناسبًا لمحتوى الفيديو (4 كلمات على الأقل).',
  },
  {
    id: 'tsk-4',
    platform: 'youtube',
    service: 'yt_subscribe',
    actionType: 'subscribe',
    actionLabel: 'اشتراك في قناة',
    handle: '@CodeArabi',
    title: 'كود عربي — دروس برمجة وتصميم مواقع',
    targetUrl: 'https://www.youtube.com/@CodeArabi',
    reward: 0.022,
    remaining: 92,
    pinned: true,
    note: 'اشترك بالقناة من حساب يوتيوب المرتبط وتأكد أن اشتراكاتك ظاهرة.',
  },
  {
    id: 'tsk-5',
    platform: 'youtube',
    service: 'yt_comment',
    actionType: 'comment',
    actionLabel: 'تعليق على فيديو',
    handle: '@TravelWithOmar',
    title: 'أجمل 5 مدن ساحلية في الصيف',
    targetUrl: 'https://www.youtube.com/@TravelWithOmar',
    reward: 0.024,
    remaining: 48,
    note: 'اكتب تعليقًا متعلقًا بموضوع الفيديو بدون روابط.',
  },
  {
    id: 'tsk-6',
    platform: 'instagram',
    service: 'ig_follow',
    actionType: 'follow',
    actionLabel: 'متابعة حساب',
    handle: '@noura.design',
    title: 'نورا ديزاين — تصميم داخلي وديكور',
    targetUrl: 'https://www.instagram.com/noura.design',
    reward: 0.014,
    remaining: 310,
    note: 'الحساب عام؛ اضغط متابعة ثم ارجع للتأكيد.',
  },
  {
    id: 'tsk-7',
    platform: 'instagram',
    service: 'ig_like',
    actionType: 'like',
    actionLabel: 'إعجاب بمنشور',
    handle: '@fit.karim',
    title: 'تمارين منزلية بدون أدوات للمبتدئين',
    targetUrl: 'https://www.instagram.com/fit.karim',
    reward: 0.008,
    remaining: 540,
    note: 'مهمة لايكات إنستجرام الجديدة — تدخل في المسابقة اليومية.',
  },
  {
    id: 'tsk-8',
    platform: 'twitter',
    service: 'twitter_follow',
    actionType: 'follow',
    actionLabel: 'متابعة حساب X',
    handle: '@arab_founders',
    title: 'رواد الأعمال العرب — أخبار الشركات الناشئة',
    targetUrl: 'https://x.com/arab_founders',
    reward: 0.015,
    remaining: 135,
  },
  {
    id: 'tsk-9',
    platform: 'twitter',
    service: 'twitter_retweet',
    actionType: 'retweet',
    actionLabel: 'إعادة نشر تغريدة',
    handle: '@tech_pulse_ar',
    title: 'ملخص أبرز إطلاقات الذكاء الاصطناعي هذا الأسبوع',
    targetUrl: 'https://x.com/tech_pulse_ar',
    reward: 0.011,
    remaining: 210,
  },
  {
    id: 'tsk-10',
    platform: 'twitter',
    service: 'twitter_reply',
    actionType: 'comment',
    actionLabel: 'رد على تغريدة',
    handle: '@design_notes_ar',
    title: 'ما أفضل أداة تستخدمها لتنظيم يومك؟',
    targetUrl: 'https://x.com/design_notes_ar',
    reward: 0.019,
    remaining: 74,
  },
];

export const PARTNER_OFFERS_SEED = [
  {
    id: 'off-1',
    partner: 'Torox',
    title: 'تثبيت وتجربة لعبة Puzzle Quest حتى المستوى 10',
    category: 'ألعاب',
    reward: 1.45,
    duration: '15 دقيقة',
    device: 'Android',
  },
  {
    id: 'off-2',
    partner: 'CPX Research',
    title: 'استبيان رأي المستهلكين حول التسوق الإلكتروني',
    category: 'استبيانات',
    reward: 0.65,
    duration: '6 دقائق',
    device: 'الكل',
  },
  {
    id: 'off-3',
    partner: 'Torox',
    title: 'إنشاء حساب مجاني وتجربة تطبيق الملاحظات السحابي',
    category: 'تطبيقات',
    reward: 0.9,
    duration: '5 دقائق',
    device: 'Android / Web',
  },
  {
    id: 'off-4',
    partner: 'BitLabs',
    title: 'استطلاع سريع حول تطبيقات الدفع الرقمي في المنطقة العربية',
    category: 'استبيانات',
    reward: 0.45,
    duration: '4 دقائق',
    device: 'الكل',
  },
];

export const TRUSTED_TRADERS: TrustedTrader[] = [
  {
    id: 'tr-1',
    name: 'أبو عمر للصرافة الرقمية',
    country: 'مصر',
    flag: '🇪🇬',
    methods: ['فودافون كاش', 'إنستاباي', 'أورنج كاش'],
    rating: 4.9,
    tradesCount: 1420,
    buyRate: '49.50 ج.م / $',
    sellRate: '48.20 ج.م / $',
    online: true,
    verified: true,
    minUsd: 2,
    maxUsd: 500,
  },
  {
    id: 'tr-2',
    name: 'بغداد باي — Baghdad Pay',
    country: 'العراق',
    flag: '🇮🇶',
    methods: ['زين كاش', 'كي كارد', 'آسيا حوالة'],
    rating: 4.8,
    tradesCount: 830,
    buyRate: '1,510 د.ع / $',
    sellRate: '1,465 د.ع / $',
    online: true,
    verified: true,
    minUsd: 5,
    maxUsd: 300,
  },
  {
    id: 'tr-3',
    name: 'الخليج للتبادل السريع',
    country: 'السعودية',
    flag: '🇸🇦',
    methods: ['STC Pay', 'الراجحي', 'تحويل بنكي'],
    rating: 4.95,
    tradesCount: 645,
    buyRate: '3.82 ر.س / $',
    sellRate: '3.70 ر.س / $',
    online: true,
    verified: true,
    minUsd: 5,
    maxUsd: 1000,
  },
  {
    id: 'tr-4',
    name: 'الأطلس كاش المغرب',
    country: 'المغرب',
    flag: '🇲🇦',
    methods: ['CIH Bank', 'Cash Plus', 'Barid Bank'],
    rating: 4.85,
    tradesCount: 512,
    buyRate: '10.30 د.م / $',
    sellRate: '9.85 د.م / $',
    online: false,
    verified: true,
    minUsd: 3,
    maxUsd: 400,
  },
  {
    id: 'tr-5',
    name: 'كريبتو دايركت العالمي',
    country: 'عالمي',
    flag: '🌐',
    methods: ['Binance Pay', 'USDT TRC20', 'Payeer'],
    rating: 4.92,
    tradesCount: 2180,
    buyRate: '1.02 $ / $',
    sellRate: '0.99 $ / $',
    online: true,
    verified: true,
    minUsd: 2,
    maxUsd: 2000,
  },
];

export const INITIAL_AUCTIONS: AuctionListing[] = [
  {
    id: 'auc-1',
    referralCode: 'REF-#8842',
    seller: 'أحمد سامي',
    tasksCompleted: 1420,
    monthlyEarnings: 16.4,
    currentBid: 4.5,
    minIncrement: 0.5,
    bidsCount: 9,
    endsIn: '4 ساعات و22 دقيقة',
    activeDays: 45,
  },
  {
    id: 'auc-2',
    referralCode: 'REF-#9105',
    seller: 'نورهان م.',
    tasksCompleted: 2890,
    monthlyEarnings: 31.2,
    currentBid: 8.0,
    minIncrement: 0.5,
    bidsCount: 14,
    endsIn: '11 ساعة و08 دقائق',
    activeDays: 72,
  },
  {
    id: 'auc-3',
    referralCode: 'REF-#7431',
    seller: 'كريم طارق',
    tasksCompleted: 690,
    monthlyEarnings: 8.1,
    currentBid: 2.25,
    minIncrement: 0.25,
    bidsCount: 5,
    endsIn: 'يوم و3 ساعات',
    activeDays: 29,
  },
];

export const PLATFORM_RECORDS = [
  {
    id: 'rec-1',
    category: 'المهام',
    title: 'أكثر مهام مقبولة في يوم واحد',
    holder: 'Mino',
    maskedEmail: 'mo***@gmail.com',
    value: '618 مهمة',
    date: '19/11/2026',
  },
  {
    id: 'rec-2',
    category: 'المهام',
    title: 'أعلى إجمالي مهام منفّذة على المنصة',
    holder: 'Mino',
    maskedEmail: 'mo***@gmail.com',
    value: '28,410 مهمة',
    date: '24/11/2026',
  },
  {
    id: 'rec-3',
    category: 'الأرباح',
    title: 'أكبر ربح من المسابقات في شهر واحد',
    holder: 'Abdallah',
    maskedEmail: 'a0***@gmail.com',
    value: '$185.00',
    date: '15/11/2026',
  },
  {
    id: 'rec-4',
    category: 'الدعوات',
    title: 'أعلى عدد إحالات مؤكدة نشطة',
    holder: 'حسام الدين',
    maskedEmail: 'ho***@gmail.com',
    value: '142 إحالة',
    date: '10/11/2026',
  },
  {
    id: 'rec-5',
    category: 'الحملات',
    title: 'أسرع حملة اكتملت (1,000 متابعة)',
    holder: 'شركة نجم للتسويق',
    maskedEmail: 'na***@gmail.com',
    value: 'خلال 3 ساعات و14 دقيقة',
    date: '21/11/2026',
  },
  {
    id: 'rec-6',
    category: 'الثقة',
    title: 'أعلى رصيد نقاط ثقة بدون أي مخالفة',
    holder: 'يوسف 🇸🇩',
    maskedEmail: 'yu***@gmail.com',
    value: '2,340 نقطة 💎',
    date: '24/11/2026',
  },
];

export const INITIAL_CAMPAIGNS: CampaignRecord[] = [
  {
    id: 'cmp-101',
    service: 'follow',
    platform: 'tiktok',
    title: 'حملة متابعات تيك توك — @my.brand.eg',
    targetUrl: 'https://www.tiktok.com/@my.brand.eg',
    targetQuantity: 200,
    completedCount: 146,
    compensatedCount: 6,
    totalBudget: 3.6,
    withGuarantee: true,
    guaranteeUntil: '20/12/2026',
    status: 'نشطة',
    createdAt: '20/11/2026',
  },
  {
    id: 'cmp-102',
    service: 'ig_like',
    platform: 'instagram',
    title: 'حملة إعجابات إنستجرام — منشور الإطلاق',
    targetUrl: 'https://www.instagram.com/p/C9xLaunch/',
    targetQuantity: 150,
    completedCount: 150,
    compensatedCount: 0,
    totalBudget: 1.5,
    withGuarantee: false,
    status: 'مكتملة',
    createdAt: '14/11/2026',
  },
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    type: 'deposit',
    title: 'شحن رصيد عبر التاجر المعتمد (أبو عمر)',
    amount: 10.0,
    balanceType: 'available',
    date: '22/11/2026 14:20',
    status: 'مكتملة',
  },
  {
    id: 'tx-2',
    type: 'campaign',
    title: 'تمويل حملة متابعات تيك توك (200 متابعة + ضمان)',
    amount: -3.6,
    balanceType: 'available',
    date: '20/11/2026 18:05',
    status: 'مكتملة',
  },
  {
    id: 'tx-3',
    type: 'earn',
    title: 'مكافآت تنفيذ 42 مهمة تيك توك وإنستجرام',
    amount: 0.58,
    balanceType: 'available',
    date: '19/11/2026 21:40',
    status: 'مكتملة',
  },
  {
    id: 'tx-4',
    type: 'referral',
    title: 'عمولة دعوة أصدقاء (3 مدعوين نشطين)',
    amount: 0.42,
    balanceType: 'available',
    date: '18/11/2026 11:12',
    status: 'مكتملة',
  },
];

export const INITIAL_LINKED_ACCOUNTS: LinkedAccount[] = [
  {
    id: 'acc-1',
    platform: 'tiktok',
    handle: '@tafa3al.member',
    followers: 128,
    verified: true,
    active: true,
    addedAt: '12/11/2026',
  },
  {
    id: 'acc-2',
    platform: 'instagram',
    handle: '@tafa3al.ig',
    followers: 84,
    verified: true,
    active: true,
    addedAt: '15/11/2026',
  },
];
