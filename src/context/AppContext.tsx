import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  AuctionListing,
  CampaignRecord,
  INITIAL_AUCTIONS,
  INITIAL_CAMPAIGNS,
  INITIAL_LINKED_ACCOUNTS,
  INITIAL_TASKS,
  INITIAL_TRANSACTIONS,
  LinkedAccount,
  SocialTask,
  SupportTicket,
  TraderChatThread,
  WalletTransaction,
} from '../data/workspaceSeed';
import { OFFICIAL_UPDATES, UpdatePost } from '../data/siteContent';
import {
  calculateCampaignCost,
  calculateCampaignRefund,
  calculateMemberRank,
  calculateNetReward,
  ServiceId,
  CAMPAIGN_SERVICES,
} from '../utils/platformLogic';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  country: string;
  interests: string[];
  trustPoints: number;
  cleanWithdrawals: number;
  availableBalance: number;
  adBalance: number;
  referralCode: string;
  joinedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface PersistedState {
  darkMode: boolean;
  bannerDismissed: boolean;
  user: UserProfile | null;
  completedTaskIds: string[];
  skippedTaskIds: string[];
  claimedOfferIds: string[];
  joinedContestIds: string[];
  accounts: LinkedAccount[];
  transactions: WalletTransaction[];
  campaigns: CampaignRecord[];
  auctions: AuctionListing[];
  tickets: SupportTicket[];
  traderChats: TraderChatThread[];
  updateReactions: Record<string, 'like' | 'love' | null>;
  updateComments: Record<string, { id: string; author: string; text: string; date: string }[]>;
  notifications: NotificationItem[];
}

const STORAGE_KEY = 'tfa3al_replica_state_v1';

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'مسابقة تيك توك اليومية بدأت 🎵',
    body: 'كل الأعضاء مشتركين تلقائيًا — الجائزة 10$ للمركز الأول.',
    time: 'منذ ساعة',
    read: false,
  },
  {
    id: 'n2',
    title: 'تحديث مهم على فحص السحب',
    body: 'تم تحسين سرعة مراجعة طلبات السحب وتقليل وقت الانتظار.',
    time: 'اليوم',
    read: false,
  },
  {
    id: 'n3',
    title: 'إضافة حسابات غير محدودة',
    body: 'يمكنك الآن ربط أي عدد من حسابات TikTok وInstagram وX بدون حد أقصى.',
    time: 'أمس',
    read: true,
  },
];

const DEFAULT_CHATS: TraderChatThread[] = [
  {
    id: 'chat-1',
    traderId: 'tr-1',
    traderName: 'أبو عمر للصرافة الرقمية',
    orderType: 'شحن رصيد',
    amountUsd: 10,
    method: 'فودافون كاش',
    status: 'مكتملة',
    messages: [
      { sender: 'trader', text: 'أهلًا بك، تم استلام طلب شحن 10$ عبر فودافون كاش. يمكنك التحويل على الرقم 010XXXXXXXX وإرسال لقطة الشاشة هنا.', time: '14:12' },
      { sender: 'user', text: 'تم التحويل الآن بمبلغ 495 ج.م وإرفاق رقم العملية.', time: '14:18' },
      { sender: 'trader', text: 'تم التأكيد وإضافة 10.00$ إلى محفظتك فورًا. شكرًا لتعاملك معنا!', time: '14:20' },
    ],
  },
];

const DEFAULT_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-4092',
    subject: 'استفسار عن مدة ضمان التعويض في حملات تيك توك',
    category: 'الحملات',
    status: 'تم الرد',
    createdAt: '21/11/2026',
    messages: [
      { sender: 'user', text: 'السلام عليكم، كم مدة تغطية ضمان التعويض عند تفعيله في حملة المتابعات؟', time: '21/11 10:15' },
      { sender: 'support', text: 'وعليكم السلام! عند تفعيل ضمان التعويض، يتم تعويض أي متابعة ملغاة تلقائيًا لمدة 30 يومًا ضمن ميزانية الضمان المعتمدة، ويمكنك متابعة عدد المتابعات المعوّضة من كارت الحملة.', time: '21/11 10:42' },
    ],
  },
];

function createInitialState(): PersistedState {
  return {
    darkMode: false,
    bannerDismissed: false,
    user: null,
    completedTaskIds: [],
    skippedTaskIds: [],
    claimedOfferIds: [],
    joinedContestIds: ['daily-tiktok-25', 'daily-tiktok-likes-25'],
    accounts: INITIAL_LINKED_ACCOUNTS,
    transactions: INITIAL_TRANSACTIONS,
    campaigns: INITIAL_CAMPAIGNS,
    auctions: INITIAL_AUCTIONS,
    tickets: DEFAULT_TICKETS,
    traderChats: DEFAULT_CHATS,
    updateReactions: {},
    updateComments: {},
    notifications: DEFAULT_NOTIFICATIONS,
  };
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return { ...createInitialState(), ...parsed };
  } catch {
    return createInitialState();
  }
}

function nowFormatted(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

interface AppContextValue {
  state: PersistedState;
  tasks: SocialTask[];
  updates: UpdatePost[];
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  toggleDarkMode: () => void;
  dismissBanner: () => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  deleteUserAccount: () => void;
  updateProfile: (patch: Partial<Pick<UserProfile, 'name' | 'country' | 'interests'>>) => void;
  completeTask: (taskId: string) => boolean;
  skipTask: (taskId: string) => void;
  claimPartnerOffer: (offerId: string, title: string, reward: number) => boolean;
  addLinkedAccount: (platform: LinkedAccount['platform'], handle: string) => void;
  toggleAccountActive: (id: string) => void;
  removeLinkedAccount: (id: string) => void;
  depositDemoFunds: (amount: number, methodLabel: string) => void;
  requestWithdrawal: (amount: number, method: string, destination: string) => { ok: boolean; error?: string };
  launchCampaign: (params: {
    service: ServiceId;
    targetUrl: string;
    quantity: number;
    withGuarantee: boolean;
  }) => { ok: boolean; error?: string; campaignId?: string };
  toggleCampaignPause: (campaignId: string) => void;
  cancelCampaign: (campaignId: string) => void;
  placeAuctionBid: (auctionId: string, bidAmount: number) => { ok: boolean; error?: string };
  joinContest: (contestId: string) => void;
  createSupportTicket: (subject: string, category: string, body: string) => void;
  replySupportTicket: (ticketId: string, text: string) => void;
  startTraderChat: (traderId: string, traderName: string, orderType: 'شحن رصيد' | 'بيع رصيد', amountUsd: number, method: string) => string;
  sendTraderMessage: (chatId: string, text: string) => void;
  toggleUpdateReaction: (postId: string, kind: 'like' | 'love') => void;
  addUpdateComment: (postId: string, text: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadState());
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.darkMode]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const dismissBanner = useCallback(() => {
    setState((prev) => ({ ...prev, bannerDismissed: true }));
  }, []);

  const login = useCallback((email: string, name?: string) => {
    const cleanEmail = email.trim() || 'member@tfa3al.com';
    const cleanName = (name && name.trim()) || cleanEmail.split('@')[0] || 'عضو تفاعل';
    setState((prev) => ({
      ...prev,
      user: {
        id: 'TF-84291',
        name: cleanName,
        email: cleanEmail,
        country: 'مصر',
        interests: ['تقنية', 'محتوى تعليمي', 'تسويق رقمي'],
        trustPoints: 245,
        cleanWithdrawals: 2,
        availableBalance: 7.4,
        adBalance: 5.0,
        referralCode: 'TF84291',
        joinedAt: '10/11/2026',
      },
    }));
    showToast(`أهلًا بك يا ${cleanName} في تفاعل`, 'success');
  }, [showToast]);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, user: null }));
    showToast('تم تسجيل الخروج بنجاح', 'info');
  }, [showToast]);

  const deleteUserAccount = useCallback(() => {
    setState((prev) => ({
      ...prev,
      user: null,
      accounts: [],
      tickets: [],
      traderChats: [],
    }));
    showToast('تم حذف حسابك وبياناتك الشخصية فورًا', 'info');
  }, [showToast]);

  const updateProfile = useCallback(
    (patch: Partial<Pick<UserProfile, 'name' | 'country' | 'interests'>>) => {
      setState((prev) => {
        if (!prev.user) return prev;
        return { ...prev, user: { ...prev.user, ...patch } };
      });
      showToast('تم حفظ تحديثات ملفك الشخصي', 'success');
    },
    [showToast]
  );

  const completeTask = useCallback(
    (taskId: string) => {
      const task = INITIAL_TASKS.find((t) => t.id === taskId);
      if (!task || !state.user || state.completedTaskIds.includes(taskId)) return false;
      const rank = calculateMemberRank(state.user.trustPoints, state.user.cleanWithdrawals);
      const net = calculateNetReward(task.reward, rank.feePercent);
      const tx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'earn',
        title: `مكافأة ${task.actionLabel} (${task.handle})`,
        amount: net,
        balanceType: 'available',
        date: nowFormatted(),
        status: 'مكتملة',
      };
      setState((prev) => {
        if (!prev.user) return prev;
        return {
          ...prev,
          completedTaskIds: [...prev.completedTaskIds, taskId],
          user: {
            ...prev.user,
            availableBalance: Number((prev.user.availableBalance + net).toFixed(4)),
            trustPoints: prev.user.trustPoints + 5,
          },
          transactions: [tx, ...prev.transactions],
        };
      });
      showToast(`تم تأكيد المهمة وإضافة $${net.toFixed(4)} لمحفظتك (+5 نقاط ثقة)`, 'success');
      return true;
    },
    [state.user, state.completedTaskIds, showToast]
  );

  const skipTask = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      skippedTaskIds: [...prev.skippedTaskIds, taskId],
    }));
    showToast('تم تخطي المهمة وإخفاؤها من القائمة', 'info');
  }, [showToast]);

  const claimPartnerOffer = useCallback(
    (offerId: string, title: string, reward: number) => {
      if (!state.user || state.claimedOfferIds.includes(offerId)) return false;
      const tx: WalletTransaction = {
        id: `tx-off-${Date.now()}`,
        type: 'earn',
        title: `مكافأة عرض شريك: ${title}`,
        amount: reward,
        balanceType: 'available',
        date: nowFormatted(),
        status: 'مكتملة',
      };
      setState((prev) => {
        if (!prev.user) return prev;
        return {
          ...prev,
          claimedOfferIds: [...prev.claimedOfferIds, offerId],
          user: {
            ...prev.user,
            availableBalance: Number((prev.user.availableBalance + reward).toFixed(2)),
          },
          transactions: [tx, ...prev.transactions],
        };
      });
      showToast(`تم تسجيل مكافأة العرض ($${reward.toFixed(2)}) في محفظتك`, 'success');
      return true;
    },
    [state.user, state.claimedOfferIds, showToast]
  );

  const addLinkedAccount = useCallback(
    (platform: LinkedAccount['platform'], handle: string) => {
      const normalized = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`;
      const newAcc: LinkedAccount = {
        id: `acc-${Date.now()}`,
        platform,
        handle: normalized,
        followers: 45 + Math.floor(Math.random() * 200),
        verified: true,
        active: true,
        addedAt: nowFormatted().split(' ')[0],
      };
      setState((prev) => ({ ...prev, accounts: [newAcc, ...prev.accounts] }));
      showToast(`تم التحقق وربط الحساب ${normalized} بنجاح`, 'success');
    },
    [showToast]
  );

  const toggleAccountActive = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      accounts: prev.accounts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    }));
  }, []);

  const removeLinkedAccount = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        accounts: prev.accounts.filter((a) => a.id !== id),
      }));
      showToast('تم حذف الحساب المرتبط (سجل أرباحك محفوظ)', 'info');
    },
    [showToast]
  );

  const depositDemoFunds = useCallback(
    (amount: number, methodLabel: string) => {
      if (amount <= 0) return;
      const tx: WalletTransaction = {
        id: `tx-dep-${Date.now()}`,
        type: 'deposit',
        title: `شحن رصيد (${methodLabel})`,
        amount,
        balanceType: 'available',
        date: nowFormatted(),
        status: 'مكتملة',
      };
      setState((prev) => {
        if (!prev.user) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            availableBalance: Number((prev.user.availableBalance + amount).toFixed(2)),
          },
          transactions: [tx, ...prev.transactions],
        };
      });
      showToast(`تم شحن $${amount.toFixed(2)} إلى رصيدك المتاح`, 'success');
    },
    [showToast]
  );

  const requestWithdrawal = useCallback(
    (amount: number, method: string, destination: string) => {
      if (!state.user) return { ok: false, error: 'يجب تسجيل الدخول أولًا.' };
      if (isNaN(amount) || amount < 2) return { ok: false, error: 'الحد الأدنى للسحب هو $2.00.' };
      if (amount > state.user.availableBalance) {
        return { ok: false, error: 'المبلغ المطلوب أكبر من رصيدك المتاح.' };
      }
      if (!destination.trim()) {
        return { ok: false, error: 'أدخل بيانات الاستلام (رقم المحفظة أو المعرّف).' };
      }
      const tx: WalletTransaction = {
        id: `tx-wd-${Date.now()}`,
        type: 'withdraw',
        title: `طلب سحب عبر ${method} (${destination.trim()})`,
        amount: -amount,
        balanceType: 'available',
        date: nowFormatted(),
        status: 'قيد المراجعة',
      };
      setState((prev) => {
        if (!prev.user) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            availableBalance: Number((prev.user.availableBalance - amount).toFixed(2)),
          },
          transactions: [tx, ...prev.transactions],
        };
      });
      showToast(`تم إرسال طلب السحب بمبلغ $${amount.toFixed(2)} للمراجعة`, 'success');
      return { ok: true };
    },
    [state.user, showToast]
  );

  const launchCampaign = useCallback(
    (params: { service: ServiceId; targetUrl: string; quantity: number; withGuarantee: boolean }) => {
      if (!state.user) return { ok: false, error: 'يجب تسجيل الدخول أولًا.' };
      const def = CAMPAIGN_SERVICES[params.service];
      if (!params.targetUrl.trim()) {
        return { ok: false, error: 'أدخل رابط الحساب أو المحتوى المستهدف.' };
      }
      if (params.quantity < def.minQuantity || params.quantity > def.maxQuantity) {
        return {
          ok: false,
          error: `الكمية يجب أن تكون بين ${def.minQuantity} و ${def.maxQuantity}.`,
        };
      }
      const cost = calculateCampaignCost(params);
      const totalSpendable = state.user.adBalance + state.user.availableBalance;
      if (cost.total > totalSpendable) {
        return {
          ok: false,
          error: `الرصيد غير كافٍ. المطلوب $${cost.total.toFixed(2)} والمتاح $${totalSpendable.toFixed(2)}.`,
        };
      }

      const adDeduct = Math.min(state.user.adBalance, cost.total);
      const availDeduct = Number((cost.total - adDeduct).toFixed(2));
      const newCampaign: CampaignRecord = {
        id: `cmp-${Date.now().toString().slice(-4)}`,
        service: params.service,
        platform: def.platform,
        title: `حملة ${def.label} — ${params.targetUrl.trim().replace(/^https?:\/\//, '').slice(0, 32)}`,
        targetUrl: params.targetUrl.trim(),
        targetQuantity: params.quantity,
        completedCount: 0,
        compensatedCount: 0,
        totalBudget: cost.total,
        withGuarantee: params.withGuarantee && def.supportsGuarantee,
        guaranteeUntil: params.withGuarantee && def.supportsGuarantee ? '24/12/2026' : undefined,
        status: 'نشطة',
        createdAt: nowFormatted().split(' ')[0],
      };
      const tx: WalletTransaction = {
        id: `tx-cmp-${Date.now()}`,
        type: 'campaign',
        title: `تمويل ${newCampaign.title} (${params.quantity} ${def.actionLabel})`,
        amount: -cost.total,
        balanceType: availDeduct > 0 ? 'available' : 'ad',
        date: nowFormatted(),
        status: 'مكتملة',
      };

      setState((prev) => {
        if (!prev.user) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            adBalance: Number((prev.user.adBalance - adDeduct).toFixed(2)),
            availableBalance: Number((prev.user.availableBalance - availDeduct).toFixed(2)),
          },
          campaigns: [newCampaign, ...prev.campaigns],
          transactions: [tx, ...prev.transactions],
        };
      });
      showToast('تم إطلاق حملتك بنجاح وحجز الميزانية', 'success');
      return { ok: true, campaignId: newCampaign.id };
    },
    [state.user, showToast]
  );

  const toggleCampaignPause = useCallback((campaignId: string) => {
    setState((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((c) => {
        if (c.id !== campaignId) return c;
        if (c.status === 'نشطة') return { ...c, status: 'متوقفة مؤقتًا' };
        if (c.status === 'متوقفة مؤقتًا') return { ...c, status: 'نشطة' };
        return c;
      }),
    }));
  }, []);

  const cancelCampaign = useCallback(
    (campaignId: string) => {
      const target = state.campaigns.find((c) => c.id === campaignId);
      if (!target || target.status === 'ملغاة' || target.status === 'مكتملة') return;
      const refund = calculateCampaignRefund({
        totalBudget: target.totalBudget,
        completedCount: target.completedCount,
        targetQuantity: target.targetQuantity,
      });
      const tx: WalletTransaction = {
        id: `tx-ref-${Date.now()}`,
        type: 'refund',
        title: `استرداد المتبقي من إلغاء ${target.title}`,
        amount: refund,
        balanceType: 'available',
        date: nowFormatted(),
        status: 'مكتملة',
      };
      setState((prev) => ({
        ...prev,
        campaigns: prev.campaigns.map((c) => (c.id === campaignId ? { ...c, status: 'ملغاة' } : c)),
        user: prev.user
          ? {
              ...prev.user,
              availableBalance: Number((prev.user.availableBalance + refund).toFixed(2)),
            }
          : null,
        transactions: refund > 0 ? [tx, ...prev.transactions] : prev.transactions,
      }));
      showToast(`تم إلغاء الحملة وإرجاع $${refund.toFixed(2)} إلى رصيدك`, 'success');
    },
    [state.campaigns, showToast]
  );

  const placeAuctionBid = useCallback(
    (auctionId: string, bidAmount: number) => {
      if (!state.user) return { ok: false, error: 'يجب تسجيل الدخول للمزايدة.' };
      const item = state.auctions.find((a) => a.id === auctionId);
      if (!item) return { ok: false, error: 'المزاد غير موجود.' };
      const minNext = Number((item.currentBid + item.minIncrement).toFixed(2));
      if (bidAmount < minNext) {
        return { ok: false, error: `الحد الأدنى للمزايدة التالية هو $${minNext.toFixed(2)}.` };
      }
      if (bidAmount > state.user.availableBalance) {
        return { ok: false, error: 'رصيدك المتاح غير كافٍ لتغطية هذه المزايدة.' };
      }
      setState((prev) => ({
        ...prev,
        auctions: prev.auctions.map((a) =>
          a.id === auctionId ? { ...a, currentBid: bidAmount, bidsCount: a.bidsCount + 1 } : a
        ),
      }));
      showToast(`تم تسجيل مزايدتك بقيمة $${bidAmount.toFixed(2)} على ${item.referralCode}`, 'success');
      return { ok: true };
    },
    [state.user, state.auctions, showToast]
  );

  const joinContest = useCallback(
    (contestId: string) => {
      if (!state.user) {
        showToast('سجّل دخولك أولًا للانضمام إلى المسابقة', 'error');
        return;
      }
      setState((prev) => ({
        ...prev,
        joinedContestIds: prev.joinedContestIds.includes(contestId)
          ? prev.joinedContestIds
          : [...prev.joinedContestIds, contestId],
      }));
      showToast('تم تسجيل انضمامك للمسابقة بنجاح!', 'success');
    },
    [state.user, showToast]
  );

  const createSupportTicket = useCallback(
    (subject: string, category: string, body: string) => {
      const newTicket: SupportTicket = {
        id: `TKT-${Math.floor(5000 + Math.random() * 4999)}`,
        subject: subject.trim(),
        category,
        status: 'مفتوحة',
        createdAt: nowFormatted().split(' ')[0],
        messages: [{ sender: 'user', text: body.trim(), time: nowFormatted() }],
      };
      setState((prev) => ({ ...prev, tickets: [newTicket, ...prev.tickets] }));
      showToast(`تم فتح التذكرة ${newTicket.id} بنجاح`, 'success');
    },
    [showToast]
  );

  const replySupportTicket = useCallback((ticketId: string, text: string) => {
    if (!text.trim()) return;
    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              messages: [...t.messages, { sender: 'user', text: text.trim(), time: nowFormatted() }],
            }
          : t
      ),
    }));
  }, []);

  const startTraderChat = useCallback(
    (traderId: string, traderName: string, orderType: 'شحن رصيد' | 'بيع رصيد', amountUsd: number, method: string) => {
      const chatId = `chat-${Date.now()}`;
      const newChat: TraderChatThread = {
        id: chatId,
        traderId,
        traderName,
        orderType,
        amountUsd,
        method,
        status: 'بانتظار التحويل',
        messages: [
          {
            sender: 'trader',
            text: `مرحبًا! تم فتح طلب ${orderType} بقيمة $${amountUsd.toFixed(2)} عبر ${method}. الرصيد محجوز لحماية الطرفين. اكتب رسالتك أو أرسل بيانات التحويل هنا.`,
            time: nowFormatted().split(' ')[1],
          },
        ],
      };
      setState((prev) => ({ ...prev, traderChats: [newChat, ...prev.traderChats] }));
      showToast(`تم فتح محادثة رسمية مع ${traderName}`, 'success');
      return chatId;
    },
    [showToast]
  );

  const sendTraderMessage = useCallback((chatId: string, text: string) => {
    if (!text.trim()) return;
    setState((prev) => ({
      ...prev,
      traderChats: prev.traderChats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { sender: 'user', text: text.trim(), time: nowFormatted().split(' ')[1] },
              ],
            }
          : c
      ),
    }));
  }, []);

  const toggleUpdateReaction = useCallback(
    (postId: string, kind: 'like' | 'love') => {
      if (!state.user) {
        showToast('سجّل دخولك عشان تتفاعل مع التحديث', 'info');
        return;
      }
      setState((prev) => {
        const current = prev.updateReactions[postId];
        return {
          ...prev,
          updateReactions: {
            ...prev.updateReactions,
            [postId]: current === kind ? null : kind,
          },
        };
      });
    },
    [state.user, showToast]
  );

  const addUpdateComment = useCallback(
    (postId: string, text: string) => {
      if (!state.user || !text.trim()) return;
      const newComment = {
        id: `uc-${Date.now()}`,
        author: state.user.name,
        text: text.trim(),
        date: 'الآن',
      };
      setState((prev) => ({
        ...prev,
        updateComments: {
          ...prev.updateComments,
          [postId]: [...(prev.updateComments[postId] || []), newComment],
        },
      }));
      showToast('تم إضافة تعليقك', 'success');
    },
    [state.user, showToast]
  );

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const availableTasks = INITIAL_TASKS.filter(
    (t) => !state.completedTaskIds.includes(t.id) && !state.skippedTaskIds.includes(t.id)
  );

  const mergedUpdates: UpdatePost[] = OFFICIAL_UPDATES.map((post) => ({
    ...post,
    likes: post.likes + (state.updateReactions[post.id] === 'like' ? 1 : 0),
    loves: post.loves + (state.updateReactions[post.id] === 'love' ? 1 : 0),
    comments: [...post.comments, ...(state.updateComments[post.id] || [])],
  }));

  return (
    <AppContext.Provider
      value={{
        state,
        tasks: availableTasks,
        updates: mergedUpdates,
        toasts,
        showToast,
        toggleDarkMode,
        dismissBanner,
        login,
        logout,
        deleteUserAccount,
        updateProfile,
        completeTask,
        skipTask,
        claimPartnerOffer,
        addLinkedAccount,
        toggleAccountActive,
        removeLinkedAccount,
        depositDemoFunds,
        requestWithdrawal,
        launchCampaign,
        toggleCampaignPause,
        cancelCampaign,
        placeAuctionBid,
        joinContest,
        createSupportTicket,
        replySupportTicket,
        startTraderChat,
        sendTraderMessage,
        toggleUpdateReaction,
        addUpdateComment,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
