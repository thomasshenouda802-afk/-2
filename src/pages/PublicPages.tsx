import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Clock,
  Gift,
  ChevronLeft,
  ChevronRight,
  Users,
  AlertCircle,
  BookOpen,
  Search,
  Megaphone,
  ThumbsUp,
  Heart,
  MessageCircle,
  BadgeCheck,
  Handshake,
  Globe,
  ArrowLeftRight,
  Wallet,
  ShieldCheck,
  Award,
  ChevronDown,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import {
  ARABIC_PRIVACY_SECTIONS,
  ARABIC_TERMS_SECTIONS,
  CONTESTS_LIST,
  GUIDE_SECTIONS,
  PARTNER_FAQS,
  RANK_TIERS,
} from '../data/siteContent';
import { PLATFORM_RECORDS } from '../data/workspaceSeed';
import { useApp } from '../context/AppContext';
import { BrandMark, PageHeader } from '../components/SharedUI';
import { calculateMemberRank, calculatePartnerProfit } from '../utils/platformLogic';

/* ========================= RANKS PAGE ========================= */
export function RanksPage() {
  const { state } = useApp();
  const currentRank = state.user
    ? calculateMemberRank(state.user.trustPoints, state.user.cleanWithdrawals)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader title="نظام الرتب ونقاط الثقة" subtitle="برونزي · فضي · ذهبي · ماسي" />

      {state.user && currentRank && (
        <div className="bg-secondary/70 border border-primary/20 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentRank.emoji}</span>
            <div>
              <div className="text-sm font-extrabold text-foreground">
                رتبتك الحالية: {currentRank.name} (رسوم الخدمة {currentRank.feePercent}%)
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                نقاط الثقة: {state.user.trustPoints} نقطة · السحوبات النظيفة:{' '}
                {state.user.cleanWithdrawals}
              </div>
            </div>
          </div>
          {currentRank.nextPointsTarget && (
            <div className="text-xs font-bold text-primary">
              متبقي {Math.max(0, currentRank.nextPointsTarget - state.user.trustPoints)} نقطة
              للمستوى التالي
            </div>
          )}
        </div>
      )}

      <section className="space-y-2">
        <h2 className="text-lg font-extrabold text-foreground">إزاي تتحسب رتبتك؟</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          الرتبة تعتمد على نقاط الثقة وسجل الالتزام والسحوبات النظيفة. نقاط الثقة مش فلوس ومش بديل
          لرصيد أرباحك. والانتقال للفضي والذهبي يحتاج النقاط والسحوبات النظيفة معًا.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-foreground">الرتب والامتيازات</h2>
        <div className="space-y-3.5">
          {RANK_TIERS.map((tier) => {
            const isCurrent = currentRank?.id === tier.id;
            return (
              <div
                key={tier.id}
                className={`bg-card border rounded-2xl p-5 sm:p-6 tfa-shadow-card ${
                  isCurrent ? 'border-primary ring-1 ring-primary/20' : 'border-border'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-lg font-extrabold text-foreground">
                    <span>{tier.emoji}</span>
                    <span>{tier.name}</span>
                    {isCurrent && (
                      <span className="text-[11px] bg-secondary text-primary px-2.5 py-0.5 rounded-full font-bold">
                        رتبتك الحالية
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {tier.requirement}
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pr-5">
                  {tier.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-6 space-y-2 tfa-shadow-card">
        <h2 className="text-base font-extrabold text-foreground">ربط الحسابات</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          بناءً على طلباتكم، تقدر تضيف وتحذف أي عدد من الحسابات على كل منصة، مهما كانت رتبتك. وضع
          أمان الحسابات مقفول للجميع. شروط التحقق من ملكية الحساب وأهلية المهام ومراجعة السحب بتفضل
          سارية.
        </p>
      </section>

      <section className="bg-card border border-border rounded-2xl p-6 space-y-2 tfa-shadow-card">
        <h2 className="text-base font-extrabold text-foreground">ملاحظات مهمة</h2>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc pr-5">
          <li>حذف حساب مش بيمنعك من إضافة حساب تاني؛ سجل المهام والأرباح بيظل محفوظ.</li>
          <li>تقدر تنفذ نفس الحملة بكل حساباتك المرتبطة المؤهلة، وكل حساب مرة واحدة بس.</li>
          <li>تغيير رتبتك مش بيحدد عدد الحسابات اللي تقدر تضيفها.</li>
          <li>
            أنظمتنا تراجع الالتزام، وتفاصيل الفحص ومعاييره تظل خاصة لحماية الأعضاء والمعلنين.
          </li>
        </ul>
      </section>
    </div>
  );
}

/* ========================= CONTESTS LIST PAGE ========================= */
export function ContestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="المسابقات" subtitle="نافس الأعضاء في تنفيذ المهام واكسب جوائز حقيقية." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONTESTS_LIST.map((contest) => (
          <article
            key={contest.id}
            className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col tfa-shadow-card"
          >
            {/* Soft blue header matching screenshot */}
            <div className="bg-secondary/65 px-5 py-4 border-b border-border/70 space-y-2.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-primary/20 text-primary font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>{contest.badge}</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-medium ${
                    contest.status === 'ended' ? 'text-muted-foreground' : 'text-foreground/80'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{contest.countdownLabel}</span>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary shrink-0" />
                <span>{contest.title}</span>
              </h3>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed line-clamp-3">
                {contest.description}
              </p>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-secondary text-primary text-xs font-extrabold">
                  <Gift className="w-4 h-4 shrink-0" />
                  <span>{contest.prizeSummary}</span>
                </div>

                <Link
                  to={`/contests/${contest.id}`}
                  className="w-full flex items-center justify-center gap-1.5 bg-secondary/70 hover:bg-secondary text-primary font-bold text-sm py-2.5 px-4 rounded-xl transition-colors"
                >
                  <span>عرض التفاصيل والانضمام</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ========================= CONTEST DETAIL PAGE ========================= */
export function ContestDetailPage() {
  const { id } = useParams();
  const { state, joinContest } = useApp();
  const contest = CONTESTS_LIST.find((c) => c.id === id) || CONTESTS_LIST[0];
  const isJoined = contest.autoJoined || state.joinedContestIds.includes(contest.id);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Link
        to="/contests"
        className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
      >
        <ChevronRight className="w-4 h-4" />
        <span>كل المسابقات</span>
      </Link>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-7 space-y-6 tfa-shadow-card">
        <div className="space-y-2.5">
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-primary shrink-0" />
            <span>{contest.title}</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{contest.description}</p>
        </div>

        {/* Countdown Boxes */}
        {contest.status === 'active' && (
          <div className="flex items-center gap-3">
            {[
              { val: contest.countdown.days, lbl: 'يوم' },
              { val: contest.countdown.hours, lbl: 'ساعة' },
              { val: contest.countdown.minutes, lbl: 'دقيقة' },
            ].map((b) => (
              <div
                key={b.lbl}
                className="w-16 py-2.5 rounded-xl bg-background border border-border text-center"
              >
                <div className="text-xl font-black text-foreground leading-none">{b.val}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{b.lbl}</div>
              </div>
            ))}
          </div>
        )}

        {/* Soft blue Prize Box */}
        <div className="bg-secondary/75 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
          <Gift className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground font-medium">الجائزة</div>
            <div className="text-sm sm:text-base font-extrabold text-foreground mt-0.5">
              {contest.prizeSummary}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{contest.prizeNote}</div>
          </div>
        </div>

        {/* Participants & End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="bg-background border border-border rounded-2xl p-4">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>المشاركين</span>
            </div>
            <div className="text-2xl font-black text-foreground mt-1">
              {contest.participantsCount + (state.joinedContestIds.includes(contest.id) ? 1 : 0)}
            </div>
          </div>
          <div className="bg-background border border-border rounded-2xl p-4">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>تنتهي في</span>
            </div>
            <div className="text-base font-extrabold text-foreground mt-2" dir="ltr">
              {contest.endsAt}
            </div>
          </div>
        </div>

        {/* Rule Note */}
        <div className="bg-warning-soft border border-warning/25 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-warning font-medium leading-relaxed">
          <Trophy className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{contest.ruleNote}</span>
        </div>

        {/* Join Action / Closed Note */}
        {contest.joinClosedNote ? (
          <div className="bg-warning-soft/80 border border-warning/20 rounded-2xl px-4 py-3 text-xs sm:text-sm text-warning font-bold">
            {contest.joinClosedNote}
          </div>
        ) : isJoined ? (
          <div className="bg-success-soft border border-success/25 rounded-2xl px-4 py-3 text-sm text-success font-bold flex items-center justify-between gap-3">
            <span>أنت مشترك في هذه المسابقة — نفّذ المهام لرفع ترتيبك!</span>
            <Link to="/earn" className="underline text-xs shrink-0">
              ابدأ المهام
            </Link>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => joinContest(contest.id)}
            className="w-full py-3 rounded-xl bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-sm tfa-shadow-primary transition-colors"
          >
            انضم للمسابقة الآن
          </button>
        )}

        {/* Top 10 Leaderboard */}
        <div className="space-y-3 pt-2">
          <h2 className="text-base font-extrabold text-foreground">أفضل 10</h2>
          <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden">
            {contest.leaderboard.map((row) => (
              <div
                key={row.rank}
                className="px-4 py-3 bg-card flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      row.rank === 1
                        ? 'bg-warning-soft text-warning'
                        : row.rank === 2
                        ? 'bg-muted text-foreground'
                        : row.rank === 3
                        ? 'bg-secondary text-primary'
                        : 'bg-background text-muted-foreground'
                    }`}
                  >
                    {row.rank}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-foreground truncate">{row.name}</div>
                    <div className="text-[11px] text-muted-foreground" dir="ltr">
                      {row.email}
                    </div>
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <div className="text-sm font-black text-primary">
                    {row.score.toLocaleString('en-US')}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{contest.unitLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================= RECORDS PAGE ========================= */
export function RecordsPage() {
  const [category, setCategory] = useState<string>('الكل');
  const [refreshing, setRefreshing] = useState(false);
  const categories = ['الكل', 'المهام', 'الأرباح', 'الدعوات', 'الحملات', 'الثقة'];

  const filtered =
    category === 'الكل'
      ? PLATFORM_RECORDS
      : PLATFORM_RECORDS.filter((r) => r.category === category);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 350);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="الأرقام القياسية"
        subtitle="أعلى الإنجازات المسجلة على منصة تفاعل في المهام والأرباح والدعوات."
        action={
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-sm font-bold text-foreground"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>تحديث</span>
          </button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-colors ${
              category === cat
                ? 'bg-secondary border-primary text-primary'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rec) => (
          <article
            key={rec.id}
            className="bg-card border border-border rounded-2xl p-5 flex items-start justify-between gap-4 tfa-shadow-card"
          >
            <div className="space-y-1.5">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary text-primary text-[11px] font-bold">
                {rec.category}
              </span>
              <h3 className="text-sm font-extrabold text-foreground">{rec.title}</h3>
              <div className="text-xs text-muted-foreground">
                حامل الرقم: <strong className="text-foreground">{rec.holder}</strong> (
                <span dir="ltr">{rec.maskedEmail}</span>)
              </div>
              <div className="text-[11px] text-muted-foreground">تاريخ التسجيل: {rec.date}</div>
            </div>
            <div className="shrink-0 text-left">
              <div className="w-10 h-10 rounded-xl bg-warning-soft text-warning flex items-center justify-center mr-auto mb-2">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-base font-black text-primary whitespace-nowrap">{rec.value}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ========================= GUIDE PAGE ========================= */
export function GuidePage() {
  const [tab, setTab] = useState<'user' | 'admin'>('user');
  const [query, setQuery] = useState('');

  const sections = GUIDE_SECTIONS.filter((s) => {
    if (s.tab !== tab) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.subtitle.toLowerCase().includes(q) ||
      s.steps.some((st) => st.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="دليل الاستخدام"
        subtitle="كل جزء في المنصة، بيعمل إيه وتستخدمه إزاي."
        action={
          <Link
            to="/support"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-sm font-bold text-foreground"
          >
            <BookOpen className="w-4 h-4" />
            <span>اسأل الدعم</span>
          </Link>
        }
      />

      {/* Tabs + Search bar matching screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab('user')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              tab === 'user'
                ? 'bg-primary text-primary-foreground tfa-shadow-primary'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            دليل المستخدم
          </button>
          <button
            type="button"
            onClick={() => setTab('admin')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              tab === 'admin'
                ? 'bg-primary text-primary-foreground tfa-shadow-primary'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            دليل الإدارة
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="مثلًا: شحن، حملة، إنذار..."
            className="w-full h-10 pr-10 pl-3 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* 2-Column TOC + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-2">
          <h2 className="text-sm font-extrabold text-foreground mb-2">المواضيع</h2>
          <ul className="space-y-1.5 text-sm">
            {sections.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className="block py-1 text-muted-foreground hover:text-primary font-medium transition-colors"
                >
                  {sec.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="lg:col-span-9 space-y-8 divide-y divide-border">
          {sections.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">
              لا توجد مواضيع مطابقة لـ «{query}».
            </div>
          ) : (
            sections.map((sec, idx) => (
              <section key={sec.id} id={sec.id} className={idx > 0 ? 'pt-8 space-y-4' : 'space-y-4'}>
                <div>
                  <h2 className="text-xl font-extrabold text-foreground">{sec.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{sec.subtitle}</p>
                </div>
                <ol className="space-y-3">
                  {sec.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                      <span className="w-6 h-6 rounded-full bg-secondary text-primary text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
                {sec.note && (
                  <div className="bg-warning-soft border border-warning/25 rounded-2xl px-4 py-3 flex items-start gap-2.5 text-xs sm:text-sm text-warning font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{sec.note}</span>
                  </div>
                )}
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================= UPDATES PAGE ========================= */
export function UpdatesPage() {
  const { state, updates, toggleUpdateReaction, addUpdateComment } = useApp();
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <PageHeader
        title="تحديثات المنصة"
        subtitle="كل جديد عن المنصة بيوصلك هنا أول بأول — تفاعل وعلّق برأيك."
        action={
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
            <Megaphone className="w-4 h-4" />
            <span>أخبار رسمية</span>
          </span>
        }
      />

      <div className="max-w-2xl mx-auto space-y-5">
        {updates.map((post) => {
          const reaction = state.updateReactions[post.id];
          const showComments = openComments[post.id];
          return (
            <article
              key={post.id}
              className="bg-card border border-border border-t-[3px] border-t-primary rounded-2xl p-5 sm:p-6 space-y-4 tfa-shadow-card"
            >
              {/* Author Header */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-primary/20">
                  <BrandMark size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-extrabold text-foreground">
                    <span>فريق تفاعل</span>
                    <BadgeCheck className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground font-normal">
                      · {post.date} · تحديث رسمي
                    </span>
                  </div>
                </div>
              </div>

              <h2 className="text-base sm:text-lg font-extrabold text-foreground">{post.title}</h2>
              <div className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">
                {post.body}
              </div>

              {/* Reaction bar */}
              <div className="pt-3 border-t border-border grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => toggleUpdateReaction(post.id, 'like')}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                    reaction === 'like'
                      ? 'bg-secondary text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>أعجبني ({post.likes})</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleUpdateReaction(post.id, 'love')}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                    reaction === 'love'
                      ? 'bg-destructive/10 text-destructive'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>أحببته ({post.loves})</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                  }
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تعليق ({post.comments.length})</span>
                </button>
              </div>

              {!state.user ? (
                <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground text-center">
                  <Link to="/auth" className="hover:text-primary hover:underline">
                    سجّل دخولك عشان تشوف التعليقات وتتفاعل مع التحديث.
                  </Link>
                </div>
              ) : (
                showComments && (
                  <div className="pt-3 border-t border-border space-y-3">
                    {post.comments.map((c) => (
                      <div key={c.id} className="bg-muted/50 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-foreground">
                          <span>{c.author}</span>
                          <span className="text-[11px] text-muted-foreground font-normal">
                            {c.date}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{c.text}</p>
                      </div>
                    ))}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const txt = commentInputs[post.id] || '';
                        if (!txt.trim()) return;
                        addUpdateComment(post.id, txt);
                        setCommentInputs((prev) => ({ ...prev, [post.id]: '' }));
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        placeholder="اكتب تعليقك..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        className="flex-1 h-9 px-3 rounded-xl bg-background border border-border text-xs focus:outline-none focus:border-primary"
                      />
                      <button
                        type="submit"
                        className="px-4 h-9 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                      >
                        إرسال
                      </button>
                    </form>
                  </div>
                )
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ========================= PARTNER PAGE ========================= */
export function PartnerPage() {
  const { showToast } = useApp();
  const [monthlyVolume, setMonthlyVolume] = useState(2000);
  const [marginPercent, setMarginPercent] = useState(5);
  const [monthlyOrders, setMonthlyOrders] = useState(20);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const [form, setForm] = useState({
    fullName: '',
    country: '',
    methods: '',
    budget: '',
    contact: '',
    notes: '',
    agreeDeposit: false,
    agreePayout: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const profit = calculatePartnerProfit({ monthlyVolume, marginPercent, monthlyOrders });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.fullName.trim() || !form.country.trim() || !form.methods.trim() || !form.contact.trim()) {
      setFormError('أكمل الحقول الأساسية (الاسم، البلد، طرق الدفع، وسيلة التواصل).');
      return;
    }
    if (!form.agreeDeposit || !form.agreePayout) {
      setFormError('يرجى الموافقة على شروط التأمين واستلام الأرباح.');
      return;
    }
    setSubmitted(true);
    showToast('تم إرسال طلب انضمامك كشريك بنجاح، سنتواصل معك قريبًا', 'success');
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="w-14 h-14 rounded-2xl bg-secondary text-primary mx-auto flex items-center justify-center">
          <Handshake className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-foreground">كن شريكًا معنا</h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          مهمتك مش إنك تبيع خدمات. مهمتك إنك تفتح باب الدفع في البلد اللي المنصة لسه مش قادرة توفّر
          فيه وسيلة دفع محلية — وكل ربحك بييجي من سوق التبادل (P2P).
        </p>
      </div>

      {/* 5 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: <Globe className="w-5 h-5" />,
            title: 'تغطّي بلدك في الدفع',
            body: 'في بلدان كتير المنصة مش قادرة توفّر فيها وسيلة دفع محلية — زي العراق مثلًا، مافيهاش وسيلة متاحة عندنا، بينما الدفع في مصر متاح. أنت بتكون الوسيلة المحلية في بلدك: بتحصّل من العميل وبتحوّل بالعملة المحلية، والمنصة بتكمّل معاك بالدولار.',
          },
          {
            icon: <ArrowLeftRight className="w-5 h-5" />,
            title: 'ربحك كله من سوق التبادل (P2P)',
            body: 'بتشتري رصيد من الأعضاء اللي عايزين يسحبوا أرباحهم، وبتبيعه لناس عايزة تشحن — والفرق بين السعرين ليك بالكامل. كل معاملة بتتسجّل جوه المنصة، فكل ما تتحرك أكتر في السوق، ربحك يكبر.',
          },
          {
            icon: <Wallet className="w-5 h-5" />,
            title: 'من غير مخزون ولا تنفيذ',
            body: 'مفيش خدمات تديرها ولا طلبات تنفذها — المنصة بتنفذ وبتأكد كل طلب. شغلك كله في الدفع والتحويل: تحصيل محلي وتحويل، والباقي علينا.',
          },
          {
            icon: <ShieldCheck className="w-5 h-5" />,
            title: 'الثقة محفوظة للطرفين',
            body: 'الرصيد بيتحجز أولًا قبل أي معاملة، والتأكيد بيحصل بعد ما الفلوس توصلك فعلًا. ولو حصل أي خلاف، الإدارة بتراجع المحادثة المحفوظة وتحكم بين الطرفين.',
          },
          {
            icon: <BadgeCheck className="w-5 h-5" />,
            title: 'رتبة التاجر المعتمد',
            body: 'مع الوقت والالتزام ممكن تاخد رتبة «تاجر معتمد» من الإدارة: بتتعفى من عمولة البيع، وبتقدر تعيد بيع رصيدك في سوق التبادل بحرية أكبر.',
          },
        ].map((card) => (
          <article
            key={card.title}
            className="bg-card border border-border rounded-2xl p-5 space-y-3 tfa-shadow-card"
          >
            <div className="w-9 h-9 rounded-xl bg-secondary text-primary flex items-center justify-center">
              {card.icon}
            </div>
            <h2 className="text-base font-extrabold text-foreground">{card.title}</h2>
            <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
              {card.body}
            </p>
          </article>
        ))}
      </div>

      {/* Interactive P2P Profit Calculator */}
      <section className="bg-card border border-border rounded-2xl p-6 sm:p-7 space-y-5 tfa-shadow-card">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">
            حاسبة تقديرية لأرباحك من سوق التبادل
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            غيّر الأرقام وشوف تقدير عملي لربحك الشهري من التبادل. الأرقام تقديرية فقط وغير مضمونة —
            ربحك الفعلي بيعتمد على حجم تعاملاتك الحقيقي وهامشك في كل معاملة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="calc-vol" className="block text-xs font-bold text-foreground mb-1.5">
              حجم العمليات الشهري (دولار)
            </label>
            <input
              id="calc-vol"
              type="number"
              min={100}
              step={100}
              value={monthlyVolume}
              onChange={(e) => setMonthlyVolume(Number(e.target.value) || 0)}
              className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm font-bold"
            />
          </div>
          <div>
            <label htmlFor="calc-margin" className="block text-xs font-bold text-foreground mb-1.5">
              هامش الربح لكل عملية (%)
            </label>
            <input
              id="calc-margin"
              type="number"
              min={1}
              max={30}
              step={0.5}
              value={marginPercent}
              onChange={(e) => setMarginPercent(Number(e.target.value) || 0)}
              className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm font-bold"
            />
          </div>
          <div>
            <label htmlFor="calc-orders" className="block text-xs font-bold text-foreground mb-1.5">
              عدد العمليات في الشهر
            </label>
            <input
              id="calc-orders"
              type="number"
              min={1}
              value={monthlyOrders}
              onChange={(e) => setMonthlyOrders(Number(e.target.value) || 1)}
              className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="bg-secondary/70 border border-primary/20 rounded-2xl p-4 text-center">
            <div className="text-xs text-muted-foreground font-medium">ربحك الشهري التقديري</div>
            <div className="text-2xl font-black text-primary mt-1" dir="ltr">
              ${profit.monthlyProfit.toLocaleString('en-US')}
            </div>
          </div>
          <div className="bg-background border border-border rounded-2xl p-4 text-center">
            <div className="text-xs text-muted-foreground font-medium">متوسط الربح لكل عملية</div>
            <div className="text-2xl font-black text-foreground mt-1" dir="ltr">
              ${profit.avgPerOrder.toLocaleString('en-US')}
            </div>
          </div>
          <div className="bg-background border border-border rounded-2xl p-4 text-center">
            <div className="text-xs text-muted-foreground font-medium">تقدير سنوي</div>
            <div className="text-2xl font-black text-success mt-1" dir="ltr">
              ${profit.annualEstimate.toLocaleString('en-US')}
            </div>
          </div>
        </div>

        <div className="bg-warning-soft border border-warning/25 rounded-xl px-4 py-3 text-xs text-warning font-medium">
          ⚠️ النتائج تقديرية غير مضمونة: هي توضيح للأرقام بس، ومش وعد أو ضمان بأي أرباح. ربحك الفعلي
          بيعتمد على الطلب في بلدك وأسعار التبادل وقتها.
        </div>
      </section>

      {/* Partner FAQ */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-foreground">أسئلة شائعة</h2>
        <div className="space-y-2.5">
          {PARTNER_FAQS.map((item, idx) => (
            <div key={item.q} className="bg-card border border-border rounded-2xl overflow-hidden">
              <button
                type="button"
                aria-expanded={openFaqIdx === idx}
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-right font-bold text-sm"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    openFaqIdx === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaqIdx === idx && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section className="bg-card border border-border rounded-2xl p-6 sm:p-7 space-y-5 tfa-shadow-card">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">قدّم طلب انضمامك</h2>
          <p className="text-sm text-muted-foreground mt-1">
            سجّل بلدك ووسائل الدفع المحلية المتاحة عندك، والإدارة هتتواصل معاك.
          </p>
        </div>

        {submitted ? (
          <div className="bg-success-soft border border-success/25 rounded-2xl p-6 text-center space-y-2 text-success">
            <div className="text-lg font-extrabold">تم استلام طلبك بنجاح!</div>
            <p className="text-sm">
              شكرًا يا {form.fullName}. سيتواصل معك فريق الإدارة عبر {form.contact} لمراجعة تفاصيل
              الشراكة في {form.country}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-bold"
              >
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">الاسم الكامل</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">البلد</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  placeholder="مثلًا: العراق، المغرب، الأردن..."
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">
                  طرق الدفع اللي تقدر توفرها للناس
                </label>
                <input
                  type="text"
                  value={form.methods}
                  onChange={(e) => setForm({ ...form, methods: e.target.value })}
                  placeholder="زين كاش، فودافون كاش، تحويل بنكي..."
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">
                  الميزانية اللي مخصصها للشغل معانا كريسيلر (بالدولار)
                </label>
                <input
                  type="number"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder="مثلًا: 200"
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                وسيلة التواصل (واتساب / تيليجرام / بريد)
              </label>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">ملاحظاتك</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-background border border-border text-sm"
              />
            </div>

            <div className="space-y-2.5 text-xs text-muted-foreground">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreeDeposit}
                  onChange={(e) => setForm({ ...form, agreeDeposit: e.target.checked })}
                  className="mt-0.5 accent-[var(--primary)]"
                />
                <span>موافق أدفع 10 دولار تأمين، وأقدر أستردها لما أحب أوقف شغل التجارة معاكم.</span>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreePayout}
                  onChange={(e) => setForm({ ...form, agreePayout: e.target.checked })}
                  className="mt-0.5 accent-[var(--primary)]"
                />
                <span>موافق أستلم أرباحي عن طريقكم باستخدام إنستاباي أو فودافون كاش أو بينانس.</span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-sm px-6 py-2.5 rounded-xl tfa-shadow-primary"
              >
                إرسال الطلب
              </button>
              <Link
                to="/exchange"
                className="bg-muted hover:bg-secondary text-foreground font-bold text-sm px-5 py-2.5 rounded-xl"
              >
                شوف التجار المعتمدين
              </Link>
              <Link
                to="/support"
                className="text-primary font-bold text-sm px-3 py-2 hover:underline"
              >
                كلم الدعم
              </Link>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

/* ========================= DELETE ACCOUNT PAGE ========================= */
export function DeleteAccountPage() {
  const { state, deleteUserAccount } = useApp();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState('');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="حذف حسابك"
        subtitle="خطوات واضحة، تنفيذ فوري، ومن غير مكالمات ولا انتظار."
      />

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4 tfa-shadow-card">
        <h2 className="text-lg font-extrabold text-foreground">إزاي تحذف حسابك</h2>
        <ol className="space-y-2.5 text-sm text-muted-foreground list-decimal pr-5">
          <li>ادخل على «حسابي» من القائمة.</li>
          <li>انزل لأسفل القسم واضغط «احذف حسابي».</li>
          <li>لو فيه رصيد أو طلب مفتوح، هنبهّلك وتخلصه الأول.</li>
          <li>اكتب «حذف حسابي» للتأكيد واضغط «تأكيد الحذف النهائي».</li>
          <li>الحذف بيتم في اللحظة اللي بتضغط فيها الزرار، ومش ممكن يتراجع.</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 space-y-2 tfa-shadow-card">
          <h2 className="text-base font-extrabold text-foreground">البيانات اللي بتمسح فورًا</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            بريد الإلكتروني وكلمة المرور، الاسم والصورة، الدولة والاهتمامات، أرقام وطرق السحب، أسماء
            حسابات TikTok وYouTube وX وInstagram المرتبطة، مفاتيح YouTube، بصمة الجهاز، رسايل
            الدردشة، تذاكر الدعم، الإشعارات، وكود الإحالة.
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 space-y-2 tfa-shadow-card">
          <h2 className="text-base font-extrabold text-foreground">البيانات اللي بتفضل محفوظة</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            سجلات الفواتير والسحوبات والمهام بتفضل محفوظة بدون اسمك أو بريدك أو أي وسيلة تواصل — بس
            مقدار المبلغ وتاريخه ونوعه. دي حاجة لازم لتسوية الأرقام، ومنع الاحتيال، وتوضيح الحقوق
            قدام جهات التدقيق.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-3 tfa-shadow-card">
        <h2 className="text-base font-extrabold text-foreground">لو مش قادر تسجل دخول</h2>
        <p className="text-sm text-muted-foreground">
          افتح تذكرة دعم من صفحة المساعدة وقولّنا إنك عايز تحذف الحساب. هنتحقق من صاحب الحساب وننفذ
          الطلب خلال 7 أيام من تاريخ التحقق.
        </p>

        {state.user ? (
          <div className="pt-3 border-t border-border space-y-3">
            <label className="block text-xs font-bold text-destructive">
              للتأكيد الفوري اكتب «حذف حسابي» ثم اضغط تأكيد:
            </label>
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="حذف حسابي"
                className="h-10 px-3.5 rounded-xl bg-background border border-border text-sm"
              />
              <button
                type="button"
                disabled={confirmText.trim() !== 'حذف حسابي'}
                onClick={() => {
                  deleteUserAccount();
                  navigate('/');
                }}
                className="inline-flex items-center gap-2 px-5 h-10 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm disabled:opacity-45"
              >
                <Trash2 className="w-4 h-4" />
                <span>تأكيد الحذف النهائي</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/auth"
              className="bg-primary text-primary-foreground font-bold text-sm px-5 py-2.5 rounded-xl"
            >
              سجل دخول ثم احذف حسابك
            </Link>
            <Link
              to="/support"
              className="bg-muted text-foreground font-bold text-sm px-5 py-2.5 rounded-xl"
            >
              تواصل مع الدعم
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================= LEGAL PAGES ========================= */
export function ArabicTermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="شروط الاستخدام وإخلاء المسؤولية"
        subtitle="آخر تحديث: 23 أكتوبر 2026 — تسري على موقع tfa3al.com وتطبيق تفاعل."
      />
      <div className="bg-card border border-border rounded-2xl p-5 space-y-2 tfa-shadow-card">
        <h2 className="text-sm font-extrabold text-foreground">المحتويات</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-primary font-bold">
          {ARABIC_TERMS_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="hover:underline">
              {s.title}
            </a>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {ARABIC_TERMS_SECTIONS.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="bg-card border border-border rounded-2xl p-6 space-y-2 tfa-shadow-card"
          >
            <h2 className="text-base font-extrabold text-foreground">{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

export function ArabicPrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="سياسة الخصوصية — تفاعل"
        subtitle="لتطبيق تفاعل على الهاتف وموقع tfa3al.com · آخر تحديث: 21 أكتوبر 2026"
      />
      <div className="space-y-4">
        {ARABIC_PRIVACY_SECTIONS.map((s) => (
          <section
            key={s.title}
            className="bg-card border border-border rounded-2xl p-6 space-y-2 tfa-shadow-card"
          >
            <h2 className="text-base font-extrabold text-foreground">{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {s.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}

export function EnglishTermsPage() {
  return (
    <div dir="ltr" className="max-w-3xl mx-auto space-y-5 text-left">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">
          Terms of Service — Tafa3al
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: October 23, 2026. Applies to tfa3al.com and the Tafa3al mobile app. The
          Arabic version (
          <Link to="/terms" className="text-primary underline">
            /terms
          </Link>
          ) prevails in case of conflict.
        </p>
      </div>
      {[
        {
          h: '1. The service',
          p: 'Tafa3al lets members earn USD rewards by completing verified social engagement tasks and, where available, offers and games supplied by third-party reward partners ("offerwalls"). Rewards are credited only after verification by our systems or confirmation by the partner. We do not guarantee any minimum earnings.',
        },
        {
          h: '2. Eligibility and accounts',
          p: 'You must provide accurate information and may hold only one Tafa3al account. You are responsible for activity on your account and for keeping your credentials secure.',
        },
        {
          h: '3. Offerwall rewards',
          p: 'Offers are provided and tracked by independent partners. A reward is credited when the partner confirms completion. Partners may reverse rewards for invalid, fraudulent or cancelled activity; reversed amounts are deducted from your balance.',
        },
        {
          h: '4. Anti-Fraud & Fair Play Policy',
          p: 'Using VPNs, proxies, Tor, emulators, bots, automation, multiple accounts, or reversing completed actions is strictly prohibited. Any violation results in an immediate, permanent ban without payout.',
        },
        {
          h: '5. Withdrawals',
          p: 'Withdrawals are subject to minimums, fees and eligibility checks shown in the app. We may delay or decline payouts while reviewing suspected fraud.',
        },
        {
          h: '6. Changes and termination',
          p: 'We may update these terms or suspend accounts that breach them. Continued use after changes means acceptance.',
        },
      ].map((s) => (
        <section key={s.h} className="bg-card border border-border rounded-2xl p-6 space-y-2">
          <h2 className="text-base font-extrabold text-foreground">{s.h}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{s.p}</p>
        </section>
      ))}
    </div>
  );
}

export function EnglishPrivacyPage() {
  return (
    <div dir="ltr" className="max-w-3xl mx-auto space-y-5 text-left">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">
          Privacy Policy — Tafa3al
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: October 23, 2026. The Arabic version (
          <Link to="/privacy" className="text-primary underline">
            /privacy
          </Link>
          ) prevails in case of conflict.
        </p>
      </div>
      {[
        {
          h: '1. Data we collect',
          p: 'Account data (email, account ID, name, country), linked social account identifiers, task and reward activity, balances, deposits and withdrawals, payment destinations you provide, support messages, device identifiers stored in hashed form, and network information used for security.',
        },
        {
          h: '2. How we use it',
          p: 'To operate the service, verify tasks and offers, credit and pay rewards, prevent fraud and abuse, provide support, and meet legal obligations.',
        },
        {
          h: '3. Third-party reward and advertising partners',
          p: 'When you open the Play & Earn section, offerwall partners (for example Torox) receive your Tafa3al member ID and may collect device, IP address, advertising identifiers and in-game progress to track offer completion and detect fraud. We do not sell your personal data.',
        },
        {
          h: '4. Other service providers',
          p: 'We use hosting, authentication, payment and analytics providers that process data on our behalf.',
        },
        {
          h: '5. Retention and security',
          p: 'We keep data while your account is active and as needed for financial records and fraud prevention, and protect it with access controls and encryption in transit.',
        },
        {
          h: '6. Your rights',
          p: 'You may access, correct or delete your data. Request deletion via Delete account or contact Support.',
        },
      ].map((s) => (
        <section key={s.h} className="bg-card border border-border rounded-2xl p-6 space-y-2">
          <h2 className="text-base font-extrabold text-foreground">{s.h}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{s.p}</p>
        </section>
      ))}
    </div>
  );
}
