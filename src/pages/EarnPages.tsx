import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutGrid,
  Music2,
  Youtube,
  Instagram,
  Compass,
  ExternalLink,
  CheckCircle2,
  SkipForward,
  Pin,
  Wallet,
  Plus,
  Trash2,
  ShieldCheck,
  Sparkles,
  Check,
  Users,
  Heart,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AntiUnfollowNotice, AuthGateCard, PageHeader } from '../components/SharedUI';
import { PARTNER_OFFERS_SEED } from '../data/workspaceSeed';
import { calculateMemberRank, calculateNetReward } from '../utils/platformLogic';

const PLATFORM_NAV = [
  { id: 'all', label: 'الكل', to: '/earn', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'tiktok', label: 'تيك توك', to: '/earn/all', icon: <Music2 className="w-4 h-4" /> },
  { id: 'youtube', label: 'يوتيوب', to: '/youtube', icon: <Youtube className="w-4 h-4 text-red-500" /> },
  { id: 'instagram', label: 'إنستجرام', to: '/instagram', icon: <Instagram className="w-4 h-4" /> },
  {
    id: 'twitter',
    label: 'X',
    to: '/twitter',
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  { id: 'offers', label: 'عروض الشركاء', to: '/partner-offers', icon: <Compass className="w-4 h-4" /> },
];

export function EarnTasksPage({
  platform = 'all',
}: {
  platform?: 'all' | 'tiktok' | 'youtube' | 'instagram' | 'twitter';
}) {
  const { state, tasks, completeTask, skipTask } = useApp();
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as 'all' | 'follow' | 'like' | 'comment') || 'all';
  const [actionFilter, setActionFilter] = useState<'all' | 'follow' | 'like' | 'comment'>(initialType);
  const [openedTaskIds, setOpenedTaskIds] = useState<string[]>([]);

  if (!state.user) {
    return (
      <div className="space-y-5">
        <PageHeader title="المهام" subtitle="اختار المنصة والخدمة اللي هتكسب منها." />
        <AuthGateCard />
        <AntiUnfollowNotice />
      </div>
    );
  }

  const rank = calculateMemberRank(state.user.trustPoints, state.user.cleanWithdrawals);

  const visibleTasks = tasks.filter((t) => {
    if (platform !== 'all' && t.platform !== platform) return false;
    if (actionFilter === 'follow') return t.actionType === 'follow' || t.actionType === 'subscribe';
    if (actionFilter === 'like') return t.actionType === 'like' || t.actionType === 'retweet';
    if (actionFilter === 'comment') return t.actionType === 'comment';
    return true;
  });

  const handleOpenTask = (taskId: string) => {
    if (!openedTaskIds.includes(taskId)) {
      setOpenedTaskIds((prev) => [...prev, taskId]);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="المهام"
        subtitle="اختار المنصة والخدمة اللي هتكسب منها."
        action={
          <div className="flex items-center gap-2">
            <Link
              to="/accounts"
              className="px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-muted text-xs font-bold text-foreground"
            >
              حساباتي ({state.accounts.length})
            </Link>
            <Link
              to="/wallet"
              className="px-3.5 py-2 rounded-xl bg-secondary text-primary text-xs font-extrabold"
              dir="ltr"
            >
              ${state.user.availableBalance.toFixed(2)}
            </Link>
          </div>
        }
      />

      {/* Platform Switcher */}
      <nav aria-label="منصات المهام" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {PLATFORM_NAV.map((item) => {
          const isCurrent = item.id === platform;
          return (
            <Link
              key={item.id}
              to={item.to}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-colors ${
                isCurrent
                  ? 'bg-secondary border-primary text-primary'
                  : 'bg-card border-border text-foreground hover:bg-muted/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Action Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all', label: 'الكل', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
              { id: 'follow', label: 'متابعات واشتراكات', icon: <Users className="w-3.5 h-3.5" /> },
              { id: 'like', label: 'إعجابات', icon: <Heart className="w-3.5 h-3.5" /> },
              { id: 'comment', label: 'تعليقات', icon: <MessageSquare className="w-3.5 h-3.5" /> },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActionFilter(f.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors ${
                actionFilter === f.id
                  ? 'bg-secondary border-primary text-primary'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.icon}
              <span>{f.label}</span>
            </button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">
          المهام المتاحة: <strong className="text-foreground">{visibleTasks.length}</strong> · رسوم
          رتبتك ({rank.name}): {rank.feePercent}%
        </div>
      </div>

      {/* Tasks Grid */}
      {visibleTasks.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center space-y-2">
          <p className="text-base font-extrabold text-foreground">
            أتممت جميع المهام المتاحة في هذا القسم!
          </p>
          <p className="text-sm text-muted-foreground">
            جرّب اختيار منصة أخرى أو تصفّح عروض الشركاء لزيادة أرباحك.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleTasks.map((task) => {
            const netReward = calculateNetReward(task.reward, rank.feePercent);
            const isOpened = openedTaskIds.includes(task.id);
            const platformBadgeClass =
              task.platform === 'tiktok'
                ? 'tfa-platform-tiktok'
                : task.platform === 'youtube'
                ? 'tfa-platform-youtube'
                : task.platform === 'instagram'
                ? 'tfa-platform-instagram'
                : 'tfa-platform-twitter';
            const platformLabel =
              task.platform === 'tiktok'
                ? 'تيك توك'
                : task.platform === 'youtube'
                ? 'يوتيوب'
                : task.platform === 'instagram'
                ? 'إنستجرام'
                : 'X';

            return (
              <article
                key={task.id}
                className={`bg-card border rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all tfa-shadow-card ${
                  task.pinned ? 'border-warning/60' : 'border-border hover:border-primary/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${platformBadgeClass}`}
                      >
                        {platformLabel}
                      </span>
                      <span className="text-xs font-extrabold text-foreground">
                        {task.actionLabel}
                      </span>
                      {task.pinned && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-warning bg-warning-soft px-2 py-0.5 rounded-full">
                          <Pin className="w-3 h-3" /> مميزة
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => skipTask(task.id)}
                      aria-label={`تخطي مهمة ${task.handle}`}
                      title="تخطي المهمة"
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-secondary text-primary font-black flex items-center justify-center shrink-0">
                      {task.handle.replace('@', '').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-foreground truncate">
                        {task.title}
                      </div>
                      <div className="text-xs text-muted-foreground" dir="ltr">
                        {task.handle}
                      </div>
                    </div>
                  </div>

                  {task.note && (
                    <p className="text-xs text-muted-foreground bg-muted/50 rounded-xl px-3 py-2">
                      {task.note}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-muted-foreground">صافي المكافأة</div>
                    <div className="text-base font-black text-success" dir="ltr">
                      +${netReward.toFixed(4)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={task.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleOpenTask(task.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-bold text-foreground transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>افتح ونفّذ</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => completeTask(task.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isOpened
                          ? 'bg-success hover:bg-[var(--success-hover)] text-success-foreground'
                          : 'bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تأكيد التنفيذ</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <AntiUnfollowNotice />
    </div>
  );
}

/* ========================= PARTNER OFFERS PAGE ========================= */
export function PartnerOffersPage() {
  const { state, claimPartnerOffer } = useApp();

  return (
    <div className="space-y-5">
      <PageHeader
        title="عروض الشركاء"
        subtitle="تطبيقات، استبيانات ومهام قصيرة"
        action={
          <Link
            to="/wallet"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-sm font-bold text-foreground"
          >
            <Wallet className="w-4 h-4 text-primary" />
            <span>المحفظة</span>
          </Link>
        }
      />

      <nav aria-label="منصات المهام" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {PLATFORM_NAV.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-colors ${
              item.id === 'offers'
                ? 'bg-secondary border-primary text-primary'
                : 'bg-card border-border text-foreground hover:bg-muted/50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {!state.user ? (
        <AuthGateCard
          title="سجّل دخولك لعرض المكافآت"
          subtitle="عروض متاحة حسب بلدك، وسجل خاص بمكافآتك."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PARTNER_OFFERS_SEED.map((offer) => {
            const claimed = state.claimedOfferIds.includes(offer.id);
            return (
              <article
                key={offer.id}
                className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between gap-4 tfa-shadow-card"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary text-primary font-bold">
                      {offer.partner} · {offer.category}
                    </span>
                    <span className="text-muted-foreground">{offer.duration}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-foreground">{offer.title}</h3>
                  <div className="text-xs text-muted-foreground">الجهاز المطلوب: {offer.device}</div>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                  <span className="text-lg font-black text-success" dir="ltr">
                    +${offer.reward.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    disabled={claimed}
                    onClick={() => claimPartnerOffer(offer.id, offer.title, offer.reward)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                      claimed
                        ? 'bg-success-soft text-success'
                        : 'bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground'
                    }`}
                  >
                    {claimed ? 'تم استلام المكافأة ✓' : 'ابدأ العرض واحصل على المكافأة'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ========================= START PLAN PAGE ========================= */
export function StartPlanPage() {
  const { state } = useApp();
  const [goal, setGoal] = useState('');
  const [planSteps, setPlanSteps] = useState<string[] | null>(null);

  const generatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const g = goal.trim();
    if (!g) return;
    const isAdvertiser = g.includes('حملة') || g.includes('متابعين') || g.includes('ترويج') || g.includes('معلن');
    if (isAdvertiser) {
      setPlanSteps([
        'افتح صفحة «التجار المعتمدون» واشحن رصيدك بالوسيلة المحلية المناسبة لبلدك.',
        'انتقل إلى «حملة جديدة» واختر المنصة ونوع التفاعل (متابعات، إعجابات، أو تعليقات).',
        'فعّل «ضمان التعويض» لحماية متابعاتك لمدة 30 يومًا وتابع التقدم لحظة بلحظة من «حملاتي».',
      ]);
    } else {
      setPlanSteps([
        'اربط حسابك الأول على TikTok أو Instagram من صفحة «حسابات TikTok» وأكمل إثبات الملكية.',
        'ابدأ بتنفيذ 15 مهمة يوميًا من «اكسب المال» مع توزيع الشغل على أكثر من حساب للحفاظ على جودة الحساب.',
        'تابع ترتيبك في المسابقات اليومية المجانية لفرصة الفوز بـ 10$ إضافية، واطلب السحب من «سحب الأرباح» فور الوصول للحد الأدنى.',
      ]);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="قول هدفك، ونرتّبلك أول خطوات"
        subtitle="اكتب بالعامية اللي بتكلم بيها. هتستقبل خطة قصيرة تناسب وضع حسابك الحالي."
      />

      {!state.user ? (
        <AuthGateCard />
      ) : (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5 tfa-shadow-card">
          <form onSubmit={generatePlan} className="space-y-4">
            <label htmlFor="goal-input" className="block text-sm font-extrabold text-foreground">
              عايز تعمل إيه على تفاعل؟
            </label>
            <textarea
              id="goal-input"
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="مثلًا: عايز أكسب 20 دولار في الشهر من المهام، أو عايز أعمل حملة متابعين لقناتي..."
              className="w-full p-3.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary"
            />
            <div className="flex flex-wrap gap-2">
              {['عايز أبدأ أكسب من المهام اليومية', 'عايز أعمل حملة متابعين لحسابي على تيك توك'].map(
                (preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setGoal(preset)}
                    className="px-3 py-1.5 rounded-xl bg-muted hover:bg-secondary text-xs font-bold text-foreground"
                  >
                    {preset}
                  </button>
                )
              )}
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-sm px-6 py-2.5 rounded-xl tfa-shadow-primary"
            >
              <Sparkles className="w-4 h-4" />
              <span>رتّبلي خطة البدء</span>
            </button>
          </form>

          {planSteps && (
            <div className="pt-5 border-t border-border space-y-3">
              <h2 className="text-base font-extrabold text-foreground">خطتك المقترحة:</h2>
              <ol className="space-y-3">
                {planSteps.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-secondary/40 rounded-xl p-3.5 text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ========================= ACCOUNTS PAGE ========================= */
export function AccountsPage() {
  const { state, addLinkedAccount, toggleAccountActive, removeLinkedAccount } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [platform, setPlatform] = useState<'tiktok' | 'youtube' | 'instagram' | 'twitter'>('tiktok');
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!handle.trim() || handle.trim().length < 2) {
      setError('أدخل اسم المستخدم أو رابط الحساب بشكل صحيح.');
      return;
    }
    addLinkedAccount(platform, handle.trim());
    setHandle('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="حسابات TikTok"
        subtitle="أضف حساباتك، ونتحقق إنها ملكك ومؤهلة للكسب."
        action={
          state.user ? (
            <button
              type="button"
              onClick={() => setShowAdd((s) => !s)}
              className="inline-flex items-center gap-2 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-sm px-4 py-2.5 rounded-xl tfa-shadow-primary"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حساب</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-4 py-2.5 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حساب</span>
            </Link>
          )
        }
      />

      {!state.user ? (
        <AuthGateCard />
      ) : (
        <>
          {showAdd && (
            <form
              onSubmit={handleAdd}
              className="bg-card border border-primary/30 rounded-2xl p-5 space-y-4 tfa-shadow-card"
            >
              <h2 className="text-base font-extrabold text-foreground">ربط حساب جديد</h2>
              {error && (
                <div className="text-xs font-bold text-destructive bg-destructive/10 px-3 py-2 rounded-xl">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold mb-1.5">المنصة</label>
                  <select
                    value={platform}
                    onChange={(e) =>
                      setPlatform(e.target.value as 'tiktok' | 'youtube' | 'instagram' | 'twitter')
                    }
                    className="w-full h-11 px-3 rounded-xl bg-background border border-border text-sm"
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">X</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">اسم المستخدم (@username)</label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="@username"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm text-left"
                  />
                </div>
              </div>
              <div className="bg-secondary/60 rounded-xl p-3 text-xs text-muted-foreground">
                الشروط: الحساب عام، عليه 10 متابعين على الأقل وصورة شخصية. مش بنطلب كلمة السر أبدًا.
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-xl"
                >
                  تحقق وربط الحساب
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="bg-muted text-foreground font-bold text-xs px-4 py-2.5 rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.accounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-3 tfa-shadow-card"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-foreground" dir="ltr">
                      {acc.handle}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-soft text-success text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" /> موثق
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    المنصة: {acc.platform.toUpperCase()} · {acc.followers} متابع · أُضيف {acc.addedAt}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAccountActive(acc.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                      acc.active
                        ? 'bg-secondary text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {acc.active && <Check className="w-3.5 h-3.5" />}
                    <span>{acc.active ? 'نشط' : 'موقوف'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeLinkedAccount(acc.id)}
                    aria-label={`حذف الحساب ${acc.handle}`}
                    className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
