import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Megaphone,
  ShieldCheck,
  Pause,
  Play,
  XCircle,
  Plus,
  Sparkles,
  Send,
  LifeBuoy,
  Bug,
  User,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthGateCard, PageHeader } from '../components/SharedUI';
import {
  CAMPAIGN_SERVICES,
  ServiceId,
  calculateCampaignCost,
  calculateCampaignRefund,
  calculateMemberRank,
} from '../utils/platformLogic';

/* ========================= NEW CAMPAIGN PAGE ========================= */
export function NewCampaignPage() {
  const { state, launchCampaign } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const paramService = searchParams.get('service') as ServiceId | null;
  const validInitial: ServiceId =
    paramService && paramService in CAMPAIGN_SERVICES ? paramService : 'follow';

  const [service, setService] = useState<ServiceId>(validInitial);
  const [targetUrl, setTargetUrl] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [withGuarantee, setWithGuarantee] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (paramService && paramService in CAMPAIGN_SERVICES) {
      setService(paramService);
    }
  }, [paramService]);

  if (!state.user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="خلّي فكرتك توصل"
          subtitle="حملة جديدة على TikTok أو يوتيوب أو إنستجرام، خطوة بخطوة."
        />
        <AuthGateCard />
      </div>
    );
  }

  const def = CAMPAIGN_SERVICES[service];
  const cost = calculateCampaignCost({ service, quantity, withGuarantee });
  const spendable = state.user.adBalance + state.user.availableBalance;

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = launchCampaign({ service, targetUrl, quantity, withGuarantee });
    if (!res.ok) {
      setError(res.error || 'تعذر إطلاق الحملة.');
      return;
    }
    navigate('/campaigns');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="خلّي فكرتك توصل"
        subtitle="حملة جديدة على TikTok أو يوتيوب أو إنستجرام، خطوة بخطوة."
        action={
          <Link
            to="/campaigns"
            className="px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-xs font-bold text-foreground"
          >
            حملاتي ({state.campaigns.length})
          </Link>
        }
      />

      <form
        onSubmit={handleLaunch}
        className="bg-card border border-border rounded-2xl p-6 space-y-5 tfa-shadow-card"
      >
        {error && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-bold"
          >
            {error}
          </div>
        )}

        {/* Service Selector Grid */}
        <div>
          <label className="block text-xs font-extrabold text-foreground mb-2">
            1. اختر المنصة ونوع التفاعل
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(CAMPAIGN_SERVICES) as ServiceId[]).map((sid) => {
              const item = CAMPAIGN_SERVICES[sid];
              const active = sid === service;
              return (
                <button
                  key={sid}
                  type="button"
                  onClick={() => {
                    setService(sid);
                    setSearchParams({ service: sid });
                  }}
                  className={`p-3 rounded-xl border text-right transition-colors ${
                    active
                      ? 'bg-secondary border-primary text-primary'
                      : 'bg-background border-border text-foreground hover:bg-muted/50'
                  }`}
                >
                  <div className="text-xs font-extrabold">{item.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5" dir="ltr">
                    ${item.unitCost.toFixed(3)} / وحدة
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target URL */}
        <div>
          <label htmlFor="cmp-url" className="block text-xs font-extrabold text-foreground mb-1.5">
            2. رابط الحساب أو المحتوى المستهدف
          </label>
          <input
            id="cmp-url"
            type="text"
            dir="ltr"
            placeholder={def.urlPlaceholder}
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm text-left focus:outline-none focus:border-primary"
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="cmp-qty" className="block text-xs font-extrabold text-foreground mb-1.5">
            3. الكمية المطلوبة (من {def.minQuantity} إلى {def.maxQuantity})
          </label>
          <input
            id="cmp-qty"
            type="number"
            min={def.minQuantity}
            max={def.maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 0)}
            className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm font-bold"
          />
        </div>

        {/* Guarantee Toggle */}
        {def.supportsGuarantee && (
          <label className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-primary/20 cursor-pointer">
            <input
              type="checkbox"
              checked={withGuarantee}
              onChange={(e) => setWithGuarantee(e.target.checked)}
              className="mt-1 accent-[var(--primary)]"
            />
            <div>
              <div className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>تفعيل ضمان تعويض إلغاء المتابعة (+20%)</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                أي متابعة تتلغى بنعوّضها من عضو تاني تلقائيًا ضمن التغطية المعتمدة.
              </p>
            </div>
          </label>
        )}

        {/* Cost Summary */}
        <div className="bg-background border border-border rounded-2xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>التكلفة الأساسية ({quantity} وحدة)</span>
            <span dir="ltr">${cost.subtotal.toFixed(2)}</span>
          </div>
          {cost.guaranteeCost > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>ميزانية ضمان التعويض</span>
              <span dir="ltr">${cost.guaranteeCost.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-black text-foreground pt-2 border-t border-border text-base">
            <span>الإجمالي المطلوب</span>
            <span className="text-primary" dir="ltr">
              ${cost.total.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground pt-1">
            رصيدك القابل للصرف (الإعلانات + المتاح):{' '}
            <strong dir="ltr">${spendable.toFixed(2)}</strong>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 tfa-shadow-primary"
        >
          <Megaphone className="w-4 h-4" />
          <span>إطلاق الحملة الآن (${cost.total.toFixed(2)})</span>
        </button>
      </form>
    </div>
  );
}

/* ========================= MY CAMPAIGNS PAGE ========================= */
export function MyCampaignsPage() {
  const { state, toggleCampaignPause, cancelCampaign } = useApp();

  return (
    <div className="space-y-6">
      <PageHeader
        title="حملاتك، في مكان واحد"
        subtitle="خطّط لنمو حسابك، وتابع كل تفاعل بشفافية."
        action={
          <Link
            to="/campaigns/new"
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-sm px-4 py-2.5 rounded-xl tfa-shadow-primary"
          >
            <Plus className="w-4 h-4" />
            <span>حملة جديدة</span>
          </Link>
        }
      />

      {!state.user ? (
        <AuthGateCard />
      ) : state.campaigns.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center space-y-3">
          <p className="font-extrabold text-foreground">لا توجد حملات حتى الآن</p>
          <Link
            to="/campaigns/new"
            className="inline-block bg-primary text-primary-foreground font-bold text-sm px-5 py-2.5 rounded-xl"
          >
            أنشئ أول حملة
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {state.campaigns.map((cmp) => {
            const pct = Math.min(100, Math.round((cmp.completedCount / cmp.targetQuantity) * 100));
            const refundPreview = calculateCampaignRefund({
              totalBudget: cmp.totalBudget,
              completedCount: cmp.completedCount,
              targetQuantity: cmp.targetQuantity,
            });
            return (
              <article
                key={cmp.id}
                className="bg-card border border-border rounded-2xl p-5 space-y-4 tfa-shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-extrabold text-foreground">{cmp.title}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          cmp.status === 'نشطة'
                            ? 'bg-success-soft text-success'
                            : cmp.status === 'مكتملة'
                            ? 'bg-secondary text-primary'
                            : cmp.status === 'ملغاة'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-warning-soft text-warning'
                        }`}
                      >
                        {cmp.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1" dir="ltr">
                      {cmp.targetUrl}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">الميزانية</div>
                    <div className="text-base font-black text-foreground" dir="ltr">
                      ${cmp.totalBudget.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>
                      التقدم: {cmp.completedCount} / {cmp.targetQuantity}
                    </span>
                    <span className="text-primary">{pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border text-xs">
                  <div className="text-muted-foreground flex flex-wrap items-center gap-3">
                    <span>تاريخ الإنشاء: {cmp.createdAt}</span>
                    {cmp.withGuarantee && (
                      <span className="text-primary font-bold">
                        🛡️ تعويض حتى {cmp.guaranteeUntil} (تم تعويض {cmp.compensatedCount})
                      </span>
                    )}
                  </div>

                  {(cmp.status === 'نشطة' || cmp.status === 'متوقفة مؤقتًا') && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCampaignPause(cmp.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted hover:bg-secondary text-foreground font-bold"
                      >
                        {cmp.status === 'نشطة' ? (
                          <>
                            <Pause className="w-3.5 h-3.5" /> إيقاف مؤقت
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" /> استئناف
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelCampaign(cmp.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive font-bold"
                      >
                        <XCircle className="w-3.5 h-3.5" /> إلغاء واسترداد ${refundPreview.toFixed(2)}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ========================= SMART ASSISTANT PAGE ========================= */
export function AssistantPage() {
  const { state, tasks } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; text: string }[]>([
    {
      role: 'assistant',
      text: 'أهلًا بك في المساعد الذكي لتفاعل! اسألني عن رصيدك، السحب، ربط الحسابات، أو حالة حملاتك، ولو في مشكلة حقيقية هحوّلك لتذكرة دعم فورًا.',
    },
  ]);

  if (!state.user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="مساعد ذكي"
          subtitle="اسأل عن حسابك ومهامك وسحوباتك، ولو فيه مشكلة حقيقية بتتحول لفريق الدعم."
          action={
            <Link
              to="/support"
              className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground"
            >
              تذاكري
            </Link>
          }
        />
        <AuthGateCard />
      </div>
    );
  }

  const rank = calculateMemberRank(state.user.trustPoints, state.user.cleanWithdrawals);

  const answerQuestion = (q: string): string => {
    const t = q.toLowerCase();
    if (t.includes('رصيد') || t.includes('محفظ') || t.includes('فلوس')) {
      return `رصيدك المتاح حاليًا هو $${state.user!.availableBalance.toFixed(2)} ورصيد الإعلانات $${state.user!.adBalance.toFixed(2)}. لديك ${state.transactions.length} معاملة مسجلة في محفظتك.`;
    }
    if (t.includes('سحب')) {
      return `الحد الأدنى للسحب هو $2.00 عبر فودافون كاش أو إنستاباي أو Binance Pay. رتبتك الحالية هي «${rank.name}» برسوم خدمة ${rank.feePercent}% فقط.`;
    }
    if (t.includes('مهام') || t.includes('اكسب')) {
      return `يوجد حاليًا ${tasks.length} مهمة متاحة للتنفيذ على تيك توك ويوتيوب وإنستجرام وX. ابدأ من صفحة «اكسب المال» وتأكد من عدم إلغاء التفاعل بعد التأكيد.`;
    }
    if (t.includes('حمل')) {
      return `لديك ${state.campaigns.length} حملات مسجلة في «حملاتي». يمكنك إطلاق حملة جديدة مع ضمان التعويض من صفحة «حملة جديدة»، وفي حال إلغاء أي حملة يُعاد الرصيد غير المصروف فورًا.`;
    }
    return `شكرًا لسؤالك! يمكنك متابعة كل التفاصيل من «دليل الاستخدام»، وإذا واجهت مشكلة فنية في حسابك يمكنك فتح تذكرة مباشرة لفريق الدعم من زر «تذاكري» بالأعلى.`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input.trim();
    const reply = answerQuestion(q);
    setMessages((prev) => [...prev, { role: 'user', text: q }, { role: 'assistant', text: reply }]);
    setInput('');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="مساعد ذكي"
        subtitle="اسأل عن حسابك ومهامك وسحوباتك، ولو فيه مشكلة حقيقية بتتحول لفريق الدعم."
        action={
          <Link
            to="/support"
            className="px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-xs font-bold text-foreground"
          >
            تذاكري ({state.tickets.length})
          </Link>
        }
      />

      <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col min-h-[440px] tfa-shadow-card">
        <div className="flex-1 p-5 space-y-3 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'mr-auto bg-primary text-primary-foreground'
                  : 'ml-auto bg-muted text-foreground'
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {['كم رصيدي الحالي؟', 'إزاي أسحب أرباحي؟', 'كم مهمة متاحة دلوقتي؟'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  { role: 'user', text: chip },
                  { role: 'assistant', text: answerQuestion(chip) },
                ]);
              }}
              className="px-3 py-1 rounded-full bg-secondary/70 text-primary text-xs font-bold hover:bg-secondary"
            >
              {chip}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            className="flex-1 h-10 px-3.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="px-4 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xs inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>إرسال</span>
          </button>
        </form>
      </div>
    </div>
  );
}

/* ========================= SUPPORT PAGE ========================= */
export function SupportPage() {
  const { state, createSupportTicket, replySupportTicket } = useApp();
  const [searchParams] = useSearchParams();
  const isBugMode = searchParams.get('report') === 'bug';

  const [showNew, setShowNew] = useState(isBugMode);
  const [subject, setSubject] = useState(isBugMode ? 'الإبلاغ عن مشكلة تقنية' : '');
  const [category, setCategory] = useState(isBugMode ? 'بلاغ مشكلة' : 'السحب والمحفظة');
  const [body, setBody] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <PageHeader
        title="إحنا هنا علشانك"
        subtitle="اسأل، تابع، وخلّينا نساعدك."
        action={
          state.user ? (
            <button
              type="button"
              onClick={() => setShowNew((s) => !s)}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-bold text-sm px-4 py-2.5 rounded-xl tfa-shadow-primary"
            >
              <Plus className="w-4 h-4" />
              <span>تذكرة جديدة</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-bold text-sm px-4 py-2.5 rounded-xl"
            >
              <span>تذكرة جديدة</span>
            </Link>
          )
        }
      />

      {!state.user ? (
        <AuthGateCard />
      ) : (
        <>
          {showNew && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!subject.trim() || !body.trim()) return;
                createSupportTicket(subject, category, body);
                setSubject('');
                setBody('');
                setShowNew(false);
              }}
              className="bg-card border border-primary/30 rounded-2xl p-6 space-y-4 tfa-shadow-card"
            >
              <h2 className="text-base font-extrabold flex items-center gap-2">
                {isBugMode ? <Bug className="w-4 h-4 text-destructive" /> : <LifeBuoy className="w-4 h-4 text-primary" />}
                <span>{isBugMode ? 'الإبلاغ عن مشكلة' : 'فتح تذكرة دعم جديدة'}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold mb-1.5">عنوان التذكرة</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="اشرح المشكلة في سطر"
                    className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">التصنيف</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm"
                  >
                    <option>السحب والمحفظة</option>
                    <option>الحملات</option>
                    <option>الحسابات والمهام</option>
                    <option>بلاغ مشكلة</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">التفاصيل</label>
                <textarea
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="اكتب التفاصيل كاملة علشان نساعدك بأسرع وقت..."
                  className="w-full p-3 rounded-xl bg-background border border-border text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-xl"
              >
                إرسال التذكرة
              </button>
            </form>
          )}

          <div className="space-y-4">
            {state.tickets.map((tkt) => (
              <div
                key={tkt.id}
                className="bg-card border border-border rounded-2xl p-5 space-y-4 tfa-shadow-card"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-muted-foreground">{tkt.id}</span>
                    <h3 className="text-sm font-extrabold text-foreground">{tkt.subject}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary text-primary text-xs font-bold">
                    {tkt.status} · {tkt.category}
                  </span>
                </div>

                <div className="space-y-2">
                  {tkt.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        m.sender === 'support'
                          ? 'bg-secondary/50 border border-primary/15'
                          : 'bg-muted/60'
                      }`}
                    >
                      <div className="font-bold mb-1">
                        {m.sender === 'support' ? 'فريق دعم تفاعل' : 'أنت'} · {m.time}
                      </div>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const txt = replyText[tkt.id] || '';
                    if (!txt.trim()) return;
                    replySupportTicket(tkt.id, txt);
                    setReplyText((prev) => ({ ...prev, [tkt.id]: '' }));
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={replyText[tkt.id] || ''}
                    onChange={(e) =>
                      setReplyText((prev) => ({ ...prev, [tkt.id]: e.target.value }))
                    }
                    placeholder="أضف ردًا على التذكرة..."
                    className="flex-1 h-9 px-3 rounded-xl bg-background border border-border text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 h-9 rounded-xl bg-primary text-primary-foreground font-bold text-xs inline-flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> إرسال
                  </button>
                </form>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ========================= PROFILE PAGE ========================= */
export function ProfilePage() {
  const { state, updateProfile, logout } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState(state.user?.name || '');
  const [country, setCountry] = useState(state.user?.country || 'مصر');

  if (!state.user) {
    return (
      <div className="space-y-6">
        <PageHeader title="حسابي" subtitle="إدارة بياناتك ورتبتك وإعدادات حسابك." />
        <AuthGateCard />
      </div>
    );
  }

  const rank = calculateMemberRank(state.user.trustPoints, state.user.cleanWithdrawals);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader title="حسابي" subtitle="إدارة بياناتك ورتبتك وإعدادات حسابك." />

      <div className="bg-card border border-border rounded-2xl p-6 space-y-5 tfa-shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-black">
            {state.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-extrabold text-foreground flex items-center gap-2">
              <span>{state.user.name}</span>
              <span className="text-sm bg-secondary text-primary px-2.5 py-0.5 rounded-full">
                {rank.emoji} {rank.name}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5" dir="ltr">
              {state.user.email} · ID: {state.user.id}
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateProfile({ name, country });
          }}
          className="space-y-4 pt-4 border-t border-border"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">الاسم</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">الدولة</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm"
              >
                <option>مصر</option>
                <option>السعودية</option>
                <option>العراق</option>
                <option>المغرب</option>
                <option>الأردن</option>
                <option>الإمارات</option>
                <option>السودان</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-5 py-2.5 rounded-xl"
            >
              <User className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-4 py-2.5 rounded-xl bg-muted text-foreground font-bold text-sm"
            >
              تسجيل الخروج
            </button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-destructive/25 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-extrabold text-destructive">حذف الحساب نهائيًا</div>
          <p className="text-xs text-muted-foreground mt-0.5">
            يمكنك حذف حسابك وبياناتك الشخصية فورًا دون انتظار.
          </p>
        </div>
        <Link
          to="/delete-account"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-destructive/10 text-destructive font-bold text-xs shrink-0"
        >
          <Trash2 className="w-4 h-4" />
          <span>احذف حسابي</span>
        </Link>
      </div>
    </div>
  );
}
