import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  ShieldCheck,
  Wallet,
  FileCheck2,
  ArrowLeft,
  Megaphone,
  LayoutGrid,
  Music2,
  Youtube,
  Instagram,
  Compass,
  Users,
  Heart,
  MessageSquare,
  CheckCircle2,
  Globe,
  RefreshCw,
  Award,
  Search,
  ChevronDown,
  UserPlus,
  Star,
} from 'lucide-react';
import { HOME_FAQS, TRUSTPILOT_URL } from '../data/siteContent';
import { filterFaqs } from '../utils/platformLogic';
import { GooglePlayBadge } from '../components/SharedUI';

const PLATFORM_TABS = [
  { label: 'الكل', to: '/earn', icon: <LayoutGrid className="w-4 h-4" />, active: true },
  { label: 'تيك توك', to: '/earn/all', icon: <Music2 className="w-4 h-4" /> },
  { label: 'يوتيوب', to: '/youtube', icon: <Youtube className="w-4 h-4 text-red-500" /> },
  { label: 'إنستجرام', to: '/instagram', icon: <Instagram className="w-4 h-4" /> },
  {
    label: 'X',
    to: '/twitter',
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  { label: 'عروض الشركاء', to: '/partner-offers', icon: <Compass className="w-4 h-4" /> },
];

const ACTION_FILTERS = [
  { id: 'all', label: 'الكل', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { id: 'follow', label: 'متابعات', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'like', label: 'إعجابات', icon: <Heart className="w-3.5 h-3.5" /> },
  { id: 'comment', label: 'تعليقات', icon: <MessageSquare className="w-3.5 h-3.5" /> },
] as const;

export function HomePage() {
  const [selectedAction, setSelectedAction] = useState<'all' | 'follow' | 'like' | 'comment'>('all');
  const [faqCategory, setFaqCategory] = useState<'all' | 'account' | 'earnings' | 'campaigns'>('all');
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq-1']);

  const filteredFaqs = filterFaqs(HOME_FAQS, faqCategory, faqSearch);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const countByCategory = {
    all: HOME_FAQS.length,
    account: HOME_FAQS.filter((f) => f.category === 'account').length,
    earnings: HOME_FAQS.filter((f) => f.category === 'earnings').length,
    campaigns: HOME_FAQS.filter((f) => f.category === 'campaigns').length,
  };

  return (
    <div className="space-y-10">
      {/* HERO CARD */}
      <section className="bg-card border border-border rounded-[22px] p-6 sm:p-8 lg:p-10 tfa-shadow-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Right Text Column (RTL Start) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
              <Zap className="w-3.5 h-3.5" />
              <span>مهام رقمية مدفوعة · استكشاف محتوى</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-foreground leading-[1.22]">
              تفاعل: مهام رقمية ومكافآت بالدولار
            </h1>

            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-primary/20 text-primary text-xs sm:text-sm font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>مكافأة واضحة قبل كل مهمة، ومراجعة لجودة التنفيذ</span>
            </p>

            <p className="text-[15px] text-muted-foreground leading-relaxed">
              تفاعل بتربط أصحاب المحتوى بأعضاء يختاروا{' '}
              <strong className="text-foreground font-bold">مهام رقمية مقابل مكافأة مالية</strong>.
              المهام المتاحة تشمل المتابعة والاشتراك والإعجاب والتعليق والمشاهدة حسب الخدمة.
              وللمعلنين:{' '}
              <strong className="text-foreground font-bold">حملات تفاعل مدفوع</strong> بميزانية
              واضحة — مش وعد بوصول طبيعي أو نتائج مستدامة.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/earn"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-sm px-6 py-3 rounded-xl tfa-shadow-primary transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>ابدأ الربح من المهام</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                to="/campaigns/new"
                className="inline-flex items-center justify-center gap-2 bg-card hover:bg-muted text-foreground border border-border font-bold text-sm px-5 py-3 rounded-xl transition-colors"
              >
                <Megaphone className="w-4 h-4" />
                <span>أطلق حملة تفاعل</span>
              </Link>
            </div>

            <div>
              <GooglePlayBadge />
            </div>

            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs font-medium text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>مراجعة جودة التنفيذ</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-primary" />
                <span>أرباحك بالدولار في محفظتك</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-primary" />
                <span>سجل مالي شفاف وغير قابل للتعديل</span>
              </li>
            </ul>
          </div>

          {/* Left Visual Column (RTL End) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden bg-muted/40 border border-border/60 aspect-square lg:aspect-[4/4.2] flex items-center justify-center">
              <img
                src="/assets/earning-scene.jpg"
                alt="مكافآت بالدولار مقابل تنفيذ مهام على منصات التواصل"
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TASKS PLATFORM & TYPE SELECTOR */}
      <section aria-label="اختيار منصة ونوع المهام" className="space-y-4">
        <h2 className="text-xl font-extrabold text-foreground">المهام</h2>
        <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
          المهام دي مقابل مكافأة مالية، وقد تتطلب متابعة أو اشتراكًا أو إعجابًا أو تعليقًا أو مشاهدة.
          اختار المحتوى اللي يهمّك، وراجع شروط المهمة وسياسات المنصة الخارجية قبل التنفيذ؛ لو الإجراء
          مش مسموح أو مش مناسب ليك، ماتبدأش المهمة. التفاعل المدفوع مش ضمان لوصول طبيعي أو حماية من
          الحظر.
        </p>

        {/* Platform Cards Nav */}
        <nav
          aria-label="منصات المهام"
          className="flex flex-wrap items-center gap-2.5"
        >
          {PLATFORM_TABS.map((tab) => (
            <Link
              key={tab.to}
              to={
                selectedAction !== 'all' && tab.to === '/earn'
                  ? `/earn?type=${selectedAction}`
                  : tab.to
              }
              className={`inline-flex items-center justify-center gap-2 min-w-[116px] sm:min-w-[132px] px-4 py-3 rounded-xl border text-sm font-bold transition-colors ${
                tab.active
                  ? 'bg-secondary border-primary text-primary'
                  : 'bg-card border-border text-foreground hover:border-primary/40 hover:bg-muted/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </Link>
          ))}
        </nav>

        {/* Action Sub-filters */}
        <div role="group" aria-label="كل المهام" className="flex flex-wrap items-center gap-2">
          {ACTION_FILTERS.map((act) => {
            const active = selectedAction === act.id;
            return (
              <button
                key={act.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedAction(act.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors ${
                  active
                    ? 'bg-secondary border-primary text-primary'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {act.icon}
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interest Targeting Notice Banner */}
        <div className="bg-warning-soft border border-warning/25 rounded-2xl px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold text-warning">الاستهداف بالاهتمامات</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              اختار اهتمامات الجمهور لحملتك، أو سيبها لجميع الاهتمامات. تحديد اهتمامات معينة ممكن يقلل
              سرعة التنفيذ.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-card border border-warning/30 text-[11px] font-bold text-warning">
            مفعّل
          </span>
        </div>
      </section>

      {/* WHO IS IT FOR SECTION */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">المنصة دي ليك لو…</h2>
          <p className="text-sm text-muted-foreground mt-1">
            لو مستوفي شروط الأهلية، اختار تنفيذ المهام أو تمويل الحملات — أو الاتنين.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Earners Primary Blue Card */}
          <article className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-7 flex flex-col justify-between tfa-shadow-primary">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold">لمنفّذي المهام: اختار اللي يناسبك</h3>
              <p className="text-sm text-primary-foreground/85 leading-relaxed">
                تصفّح المحتوى وشروط المهمة، واختار تنفيذها بإرادتك من حسابك مقابل المكافأة المعروضة.
              </p>
              <ul className="space-y-2.5 text-sm text-primary-foreground/95">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>بتشوف المكافأة قبل ما تبدأ — من غير مفاجآت</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>بتنفّذ المهمة بنفسك من التطبيق، ومش بنطلب كلمة السر أبدًا</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>أرباحك بتظهر في محفظتك بعد التحقق، وتسحبها لما تكتمل التسوية</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                to="/earn"
                className="inline-flex items-center gap-2 bg-card text-primary font-bold text-sm px-5 py-2.5 rounded-xl hover:opacity-95 transition-opacity"
              >
                <span>ابدأ الكسب</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </article>

          {/* Advertisers White Card */}
          <article className="bg-card border border-border rounded-2xl p-6 sm:p-7 flex flex-col justify-between tfa-shadow-card">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground">
                للمعلنين: موّل مهام على محتواك
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                حدّد نوع التفاعل المطلوب ورابط المحتوى والكمية والميزانية؛ التنفيذ مرتبط بتوفر أعضاء
                مؤهلين، ومش ضمان لنتيجة تسويقية.
              </p>
              <ul className="space-y-2.5 text-sm text-foreground/90">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>ميزانيتك محجوزة من البداية — واضحة ومكشوفة</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>المهام بينفّذها أعضاء حقيقيون بأنفسهم، مش بوتات</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>لو لغيت الحملة، الفلوس اللي ما اتصرفتش بترجع لرصيدك</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                to="/campaigns/new"
                className="inline-flex items-center gap-2 bg-muted hover:bg-secondary text-foreground hover:text-primary border border-border font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                <span>أنشئ أول حملة</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">إزاي بتشتغل؟</h2>
          <p className="text-sm text-muted-foreground mt-1">
            مسارين واضحين: مهام بمكافأة مالية، أو حملة بميزانية مدفوعة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              num: '01',
              title: 'اختار مهمة',
              desc: 'اربط حسابك، وراجع المحتوى والإجراء المطلوب والمكافأة. ابدأ بس لو المهمة مناسبة ليك ومسموح بيها على المنصة الخارجية.',
            },
            {
              num: '02',
              title: 'نفّذ واستلم المكافأة',
              desc: 'نفّذ الإجراء بنفسك؛ المكافأة المالية بتُعتمد بعد التحقق. السحب حسب شروط الوسيلة ومراجعة الطلب.',
            },
            {
              num: '03',
              title: 'أنشئ حملة',
              desc: 'للمعلن: حدّد الخدمة ورابط المحتوى والكمية، واختار الاهتمامات لو الاستهداف مفعّل، ثم راجع التكلفة وموّل الحملة.',
            },
          ].map((step) => (
            <div
              key={step.num}
              className="bg-card border border-border rounded-2xl p-6 space-y-3 tfa-shadow-card"
            >
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-muted text-xs font-extrabold text-muted-foreground">
                {step.num}
              </span>
              <h3 className="text-base font-extrabold text-foreground">{step.title}</h3>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">مميزات المنصة</h2>
          <p className="text-sm text-muted-foreground mt-1">
            الأساسيات اللي بتفرق معاك — من غير مبالغة.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon={<Users className="w-5 h-5" />}
            title="أعضاء حقيقيون"
            desc="المهام بينفّذها ناس حقيقيون بأنفسهم — مش بوتات ولا حسابات وهمية."
          />
          <FeatureCard
            icon={<Globe className="w-5 h-5" />}
            title="استهداف حسب الدولة"
            badge="قريبًا"
            desc="تحدد الدولة اللي عايز جمهور حملتك منها."
          />
          <FeatureCard
            icon={<RefreshCw className="w-5 h-5" />}
            title="تعويض التفاعل الملغي"
            desc="التفاعل اللي يتلغى بنعوّضه من عضو تاني، ضمن التغطية المعتمدة."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-5 h-5" />}
            title="مراجعة جودة التنفيذ"
            desc="أنظمتنا بتراجع تنفيذ المهام، وأي تحايل بيترتب عليه خصم المكافأة أو عقوبة."
          />
          <FeatureCard
            icon={<Award className="w-5 h-5" />}
            title="نقاط ثقة لكل عضو"
            desc="بتزيد مع التنفيذ الأمين، وبتقل مع أي مخالفة."
          />
        </div>
      </section>

      {/* GOOGLE PLAY STRIP */}
      <section className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 tfa-shadow-card">
        <div className="text-center sm:text-right">
          <h2 className="text-lg font-extrabold text-foreground">تطبيق تفاعل على Google Play</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            نفّذ المهام وتابع محفظتك من موبايلك في أي وقت.
          </p>
        </div>
        <GooglePlayBadge />
      </section>

      {/* TRUSTPILOT CTA */}
      <section className="flex justify-center">
        <div className="bg-card border border-border rounded-2xl px-6 py-4 flex flex-wrap items-center justify-center gap-4 tfa-shadow-card">
          <div className="flex items-center gap-1" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="w-5 h-5 rounded-sm bg-primary/15 text-primary flex items-center justify-center"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            جرّبت «تفاعل»؟ رأيك بيفرق مع الأعضاء الجداد.
          </p>
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground text-xs font-bold px-4 py-2 rounded-xl transition-colors"
          >
            قيّمنا على Trustpilot
          </a>
        </div>
      </section>

      {/* INTERACTIVE FAQ SECTION */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">أسئلة شائعة</h2>
          <p className="text-sm text-muted-foreground mt-1">
            اكتب سؤالك أو اختار التصنيف — واللي يناسبك يطلع لك على طول.
          </p>
        </div>

        {/* Search & Category Tabs */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              aria-label="ابحث في الأسئلة الشائعة"
              placeholder="دوّر على سؤال: سحب، ضمان، كلمة سر..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full h-11 pr-10 pl-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div
            role="group"
            aria-label="تصنيفات الأسئلة"
            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          >
            {(
              [
                { id: 'all', label: 'الكل', count: countByCategory.all },
                { id: 'account', label: 'الحساب والأمان', count: countByCategory.account },
                { id: 'earnings', label: 'الأرباح والسحب', count: countByCategory.earnings },
                { id: 'campaigns', label: 'الحملات والتعويض', count: countByCategory.campaigns },
              ] as const
            ).map((cat) => {
              const active = faqCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFaqCategory(cat.id)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-colors ${
                    active
                      ? 'bg-secondary border-primary text-primary'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-xs opacity-80">{cat.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {filteredFaqs.length} أسئلة جاهزة — دوّر على اللي يخصك
        </p>

        {/* Accordion List */}
        <div className="space-y-2.5">
          {filteredFaqs.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">
              مفيش سؤال مطابق لبحثك حاليًا. تقدر تسألنا مباشرة من صفحة{' '}
              <Link to="/support" className="text-primary font-bold hover:underline">
                الدعم
              </Link>
              .
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isOpen = openFaqIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleFaq(item.id)}
                    className="w-full px-5 py-4 text-right flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
                  >
                    <span className="text-sm font-bold text-foreground">{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/50">
                      <p className="pt-3">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* FINAL BLUE CTA BANNER */}
      <section className="bg-primary text-primary-foreground rounded-[22px] px-6 py-10 text-center space-y-4 tfa-shadow-primary">
        <h2 className="text-2xl sm:text-3xl font-black">جاهز تبدأ؟ خطوة واحدة تفرق.</h2>
        <p className="text-sm text-primary-foreground/85 max-w-md mx-auto">
          سجّل حسابك، وأول مكافأة أو أول حملة بينك وبينهم خطوة.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-card text-primary font-bold text-sm px-6 py-2.5 rounded-xl hover:opacity-95 transition-opacity"
          >
            <UserPlus className="w-4 h-4" />
            <span>أنشئ حسابك</span>
          </Link>
          <Link
            to="/wallet"
            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-primary-foreground border border-white/25 font-bold text-sm px-6 py-2.5 rounded-xl transition-colors"
          >
            <Wallet className="w-4 h-4" />
            <span>شوف المحفظة</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <article className="bg-card border border-border rounded-2xl p-5 flex items-start gap-3.5 tfa-shadow-card">
      <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2 flex-wrap">
          <span>{title}</span>
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-warning-soft text-warning text-[10px] font-bold">
              {badge}
            </span>
          )}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </article>
  );
}
