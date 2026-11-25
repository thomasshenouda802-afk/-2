import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Store,
  BadgeCheck,
  Star,
  MessageCircle,
  Send,
  Copy,
  Users,
  Gavel,
  Check,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthGateCard, PageHeader } from '../components/SharedUI';
import { TRUSTED_TRADERS } from '../data/workspaceSeed';

/* ========================= WALLET PAGE ========================= */
export function WalletPage() {
  const { state, depositDemoFunds } = useApp();
  const [filter, setFilter] = useState<'all' | 'earn' | 'campaign' | 'deposit' | 'withdraw'>('all');
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState('10');

  if (!state.user) {
    return (
      <div className="space-y-6">
        <PageHeader title="محفظتك، بكل وضوح" subtitle="كل حركة محفوظة، وكل دولار له حساب." />
        <AuthGateCard />
      </div>
    );
  }

  const filteredTx = state.transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="محفظتك، بكل وضوح"
        subtitle="كل حركة محفوظة، وكل دولار له حساب."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTopup((s) => !s)}
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl tfa-shadow-primary"
            >
              <Plus className="w-4 h-4" />
              <span>شحن الرصيد</span>
            </button>
            <Link
              to="/withdraw"
              className="inline-flex items-center gap-1.5 bg-card border border-border hover:bg-muted text-foreground font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>سحب</span>
            </Link>
          </div>
        }
      />

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-primary text-primary-foreground rounded-2xl p-5 tfa-shadow-primary">
          <div className="text-xs text-primary-foreground/80 font-medium">الرصيد المتاح للسحب والحملات</div>
          <div className="text-3xl font-black mt-2" dir="ltr">
            ${state.user.availableBalance.toFixed(2)}
          </div>
          <div className="text-[11px] text-primary-foreground/75 mt-2">
            متاح للاستخدام الفوري أو السحب
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 tfa-shadow-card">
          <div className="text-xs text-muted-foreground font-medium">رصيد الإعلانات</div>
          <div className="text-3xl font-black text-foreground mt-2" dir="ltr">
            ${state.user.adBalance.toFixed(2)}
          </div>
          <div className="text-[11px] text-muted-foreground mt-2">
            مخصص لتمويل الحملات الإعلانية فقط
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 tfa-shadow-card">
          <div className="text-xs text-muted-foreground font-medium">نقاط الثقة والسجل</div>
          <div className="text-3xl font-black text-primary mt-2">{state.user.trustPoints}</div>
          <div className="text-[11px] text-muted-foreground mt-2">
            {state.transactions.length} معاملة مسجلة بالسجل غير القابل للتعديل
          </div>
        </div>
      </div>

      {showTopup && (
        <div className="bg-card border border-primary/30 rounded-2xl p-5 space-y-4 tfa-shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-extrabold text-foreground">شحن المحفظة</h2>
            <Link to="/exchange" className="text-xs font-bold text-primary hover:underline">
              اشحن من تاجر معتمد (P2P) ←
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            شحن المحفظة متاح عن طريق التجار المعتمدين، أو يمكنك إضافة رصيد تجريبي فوري لاختبار
            الحملات والمزادات الآن:
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              min={1}
              max={500}
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              className="w-32 h-10 px-3 rounded-xl bg-background border border-border text-sm font-bold"
            />
            <button
              type="button"
              onClick={() => {
                depositDemoFunds(Number(topupAmount) || 10, 'شحن عبر تاجر معتمد');
                setShowTopup(false);
              }}
              className="h-10 px-5 rounded-xl bg-success text-success-foreground font-bold text-xs"
            >
              تأكيد شحن ${Number(topupAmount || 0).toFixed(2)}
            </button>
          </div>
        </div>
      )}

      {/* Transaction Ledger */}
      <section className="bg-card border border-border rounded-2xl overflow-hidden tfa-shadow-card">
        <div className="p-4 sm:p-5 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-extrabold text-foreground">سجل المعاملات المالية</h2>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'all', label: 'الكل' },
                { id: 'earn', label: 'مهام' },
                { id: 'deposit', label: 'شحن' },
                { id: 'campaign', label: 'حملات' },
                { id: 'withdraw', label: 'سحب' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  filter === f.id
                    ? 'bg-secondary text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredTx.map((tx) => (
            <div key={tx.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.amount >= 0
                      ? 'bg-success-soft text-success'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {tx.amount >= 0 ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-foreground truncate">{tx.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {tx.date} · {tx.status}
                  </div>
                </div>
              </div>
              <div
                dir="ltr"
                className={`text-sm font-black shrink-0 ${
                  tx.amount >= 0 ? 'text-success' : 'text-foreground'
                }`}
              >
                {tx.amount >= 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ========================= WITHDRAW PAGE ========================= */
export function WithdrawPage() {
  const { state, requestWithdrawal } = useApp();
  const [method, setMethod] = useState('فودافون كاش');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');

  if (!state.user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="أرباحك، إلى حسابك"
          subtitle="اختار الطريقة، اكتب المبلغ وبيانات الاستلام، وإحنا نحوّلك."
        />
        <AuthGateCard />
      </div>
    );
  }

  const methods = [
    { name: 'فودافون كاش', min: '$2.00', hint: 'رقم محفظة فودافون كاش (010...)' },
    { name: 'إنستاباي', min: '$2.00', hint: 'عنوان إنستاباي (name@instapay) أو رقم الهاتف' },
    { name: 'Binance Pay', min: '$2.00', hint: 'معرّف Binance Pay ID' },
    { name: 'USDT (TRC20)', min: '$5.00', hint: 'عنوان محفظة TRC20 (يبدأ بـ T)' },
  ];

  const selectedMethod = methods.find((m) => m.name === method) || methods[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = requestWithdrawal(Number(amount), method, destination);
    if (!res.ok) {
      setError(res.error || 'تعذر إرسال الطلب.');
      return;
    }
    setAmount('');
    setDestination('');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="أرباحك، إلى حسابك"
        subtitle="اختار الطريقة، اكتب المبلغ وبيانات الاستلام، وإحنا نحوّلك."
      />

      <div className="bg-secondary/70 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
        <span className="text-sm font-bold text-foreground">رصيدك المتاح للسحب</span>
        <span className="text-xl font-black text-primary" dir="ltr">
          ${state.user.availableBalance.toFixed(2)}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
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

        <div>
          <label className="block text-xs font-bold mb-2">طريقة السحب</label>
          <div className="grid grid-cols-2 gap-2.5">
            {methods.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={() => setMethod(m.name)}
                className={`p-3 rounded-xl border text-right transition-colors ${
                  method === m.name
                    ? 'bg-secondary border-primary text-primary'
                    : 'bg-background border-border text-foreground hover:bg-muted/50'
                }`}
              >
                <div className="text-sm font-extrabold">{m.name}</div>
                <div className="text-[11px] text-muted-foreground">الحد الأدنى {m.min}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="wd-amount" className="block text-xs font-bold mb-1.5">
            المبلغ بالدولار (USD)
          </label>
          <input
            id="wd-amount"
            type="number"
            step="0.01"
            min="2"
            placeholder="مثلًا: 5.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm font-bold"
          />
        </div>

        <div>
          <label htmlFor="wd-dest" className="block text-xs font-bold mb-1.5">
            بيانات الاستلام
          </label>
          <input
            id="wd-dest"
            type="text"
            placeholder={selectedMethod.hint}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-sm tfa-shadow-primary"
        >
          تأكيد طلب السحب
        </button>
      </form>
    </div>
  );
}

/* ========================= EXCHANGE / TRUSTED TRADERS PAGE ========================= */
export function ExchangePage() {
  const { state, startTraderChat } = useApp();
  const navigate = useNavigate();
  const [countryFilter, setCountryFilter] = useState('الكل');
  const [activeTraderId, setActiveTraderId] = useState<string | null>(null);
  const [tradeType, setTradeType] = useState<'شحن رصيد' | 'بيع رصيد'>('شحن رصيد');
  const [tradeAmount, setTradeAmount] = useState('10');

  if (!state.user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="التجار المعتمدون"
          subtitle="اشحن أو اسحب عن طريق تاجر معتمد من الإدارة"
        />
        <AuthGateCard />
      </div>
    );
  }

  const countries = ['الكل', 'مصر', 'العراق', 'السعودية', 'المغرب', 'عالمي'];
  const filtered =
    countryFilter === 'الكل'
      ? TRUSTED_TRADERS
      : TRUSTED_TRADERS.filter((t) => t.country === countryFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="التجار المعتمدون"
        subtitle="اشحن أو اسحب عن طريق تاجر معتمد من الإدارة"
        action={
          <Link
            to="/partner"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-xs font-bold text-foreground"
          >
            <Store className="w-4 h-4 text-primary" />
            <span>انضم كتاجر</span>
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        {countries.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCountryFilter(c)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold ${
              countryFilter === c
                ? 'bg-secondary border-primary text-primary'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((trader) => {
          const isOpen = activeTraderId === trader.id;
          return (
            <article
              key={trader.id}
              className="bg-card border border-border rounded-2xl p-5 space-y-4 tfa-shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 font-extrabold text-sm text-foreground">
                    <span>{trader.flag}</span>
                    <span>{trader.name}</span>
                    {trader.verified && <BadgeCheck className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="inline-flex items-center gap-1 text-warning font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" /> {trader.rating}
                    </span>
                    <span>{trader.tradesCount} معاملة</span>
                    <span className={trader.online ? 'text-success font-bold' : ''}>
                      {trader.online ? '● متصل الآن' : '○ غير متصل'}
                    </span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-muted font-bold">
                  {trader.country}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {trader.methods.map((m) => (
                  <span
                    key={m}
                    className="px-2.5 py-1 rounded-lg bg-secondary/70 text-primary text-[11px] font-bold"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs bg-background rounded-xl p-3 border border-border">
                <div>
                  <div className="text-muted-foreground">سعر الشحن</div>
                  <div className="font-extrabold text-foreground mt-0.5">{trader.buyRate}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">سعر السحب</div>
                  <div className="font-extrabold text-foreground mt-0.5">{trader.sellRate}</div>
                </div>
              </div>

              {isOpen ? (
                <div className="pt-3 border-t border-border space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {(['شحن رصيد', 'بيع رصيد'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTradeType(t)}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          tradeType === t
                            ? 'bg-secondary border-primary text-primary'
                            : 'bg-background border-border text-muted-foreground'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={trader.minUsd}
                      max={trader.maxUsd}
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      className="w-28 h-10 px-3 rounded-xl bg-background border border-border text-sm font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        startTraderChat(
                          trader.id,
                          trader.name,
                          tradeType,
                          Number(tradeAmount) || 10,
                          trader.methods[0]
                        );
                        navigate('/reseller/chat');
                      }}
                      className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                    >
                      افتح محادثة الصفقة (${Number(tradeAmount || 0).toFixed(2)})
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTraderId(trader.id)}
                  className="w-full py-2.5 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground text-primary font-bold text-xs transition-colors"
                >
                  بدء معاملة مع التاجر
                </button>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ========================= RESELLER DASHBOARD ========================= */
export function ResellerPage() {
  const { state } = useApp();

  if (!state.user) {
    return (
      <div className="space-y-6">
        <PageHeader title="لوحة الريسيلر" subtitle="كل أدواتك كتاجر معتمد في مكان واحد." />
        <AuthGateCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="لوحة الريسيلر" subtitle="كل أدواتك كتاجر معتمد في مكان واحد." />

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4 tfa-shadow-card">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-secondary text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-foreground">
              حالة حساب التاجر: عضو عادي (غير مفعّل كريسيلر بعد)
            </h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              تقدر تقدّم طلب الانضمام كشريك دفع محلي وتاجر معتمد في بلدك، وتستفيد من سوق التبادل
              P2P بدون عمولة بيع بعد اعتمادك.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/partner"
            className="bg-primary text-primary-foreground font-bold text-sm px-5 py-2.5 rounded-xl tfa-shadow-primary"
          >
            تقديم طلب ريسيلر
          </Link>
          <Link
            to="/reseller/chat"
            className="bg-muted text-foreground font-bold text-sm px-5 py-2.5 rounded-xl"
          >
            محادثات التجار ({state.traderChats.length})
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ========================= RESELLER CHAT PAGE ========================= */
export function ResellerChatPage() {
  const { state, sendTraderMessage } = useApp();
  const [selectedId, setSelectedId] = useState<string>(state.traderChats[0]?.id || '');
  const [msg, setMsg] = useState('');

  if (!state.user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="محادثات التجار"
          subtitle="كل محادثاتك الخاصة مع التجار المعتمدين أو عملائك."
        />
        <AuthGateCard />
      </div>
    );
  }

  const activeChat = state.traderChats.find((c) => c.id === selectedId) || state.traderChats[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="محادثات التجار"
        subtitle="كل محادثاتك الخاصة مع التجار المعتمدين أو عملائك."
      />

      {state.traderChats.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-3">
          <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-bold">لا توجد محادثات تجارية حتى الآن</p>
          <Link to="/exchange" className="inline-block text-xs font-bold text-primary underline">
            تصفّح التجار المعتمدين لبدء معاملة
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {state.traderChats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => setSelectedId(chat.id)}
                className={`w-full text-right p-4 transition-colors ${
                  activeChat?.id === chat.id ? 'bg-secondary/70' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold text-foreground">{chat.traderName}</span>
                  <span className="text-xs font-black text-primary" dir="ltr">
                    ${chat.amountUsd.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {chat.orderType} · {chat.method} · {chat.status}
                </div>
              </button>
            ))}
          </div>

          {activeChat && (
            <div className="lg:col-span-8 bg-card border border-border rounded-2xl flex flex-col min-h-[420px] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-muted/40">
                <div>
                  <div className="text-sm font-extrabold">{activeChat.traderName}</div>
                  <div className="text-xs text-muted-foreground">
                    {activeChat.orderType} · ${activeChat.amountUsd.toFixed(2)} ({activeChat.method})
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary text-primary text-xs font-bold">
                  {activeChat.status}
                </span>
              </div>

              <div className="flex-1 p-5 space-y-3 overflow-y-auto">
                {activeChat.messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.sender === 'user'
                        ? 'mr-auto bg-primary text-primary-foreground'
                        : 'ml-auto bg-muted text-foreground'
                    }`}
                  >
                    <p>{m.text}</p>
                    <div className="text-[10px] opacity-75 mt-1">{m.time}</div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!msg.trim()) return;
                  sendTraderMessage(activeChat.id, msg);
                  setMsg('');
                }}
                className="p-3 border-t border-border flex gap-2"
              >
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="اكتب رسالتك أو رقم التحويل..."
                  className="flex-1 h-10 px-3.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-4 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ========================= REFERRALS PAGE ========================= */
export function ReferralsPage() {
  const { state, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!state.user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="ادعُ أصحابك، وربحك بيكبر"
          subtitle="هدية من المنصة على أي دخل للي دعيته (مهام، إيداعات، جوايز، بيع إحالات) — مدى الحياة، ومن غير ما يتخصم منه قرش."
        />
        <AuthGateCard />
      </div>
    );
  }

  const refUrl = `https://tfa3al.com/?ref=${state.user.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(refUrl).catch(() => {});
    setCopied(true);
    showToast('تم نسخ رابط الدعوة الخاص بك', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ادعُ أصحابك، وربحك بيكبر"
        subtitle="هدية من المنصة على أي دخل للي دعيته (مهام، إيداعات، جوايز، بيع إحالات) — مدى الحياة، ومن غير ما يتخصم منه قرش."
      />

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4 tfa-shadow-card">
        <div className="text-sm font-extrabold text-foreground">رابط دعوتك الشخصي</div>
        <div className="flex flex-wrap gap-2">
          <input
            readOnly
            dir="ltr"
            value={refUrl}
            className="flex-1 h-11 px-3.5 rounded-xl bg-background border border-border text-sm font-mono text-left"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-xs text-muted-foreground">إجمالي المدعوين</div>
          <div className="text-2xl font-black mt-1">3</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-xs text-muted-foreground">إجمالي عمولات الدعوات</div>
          <div className="text-2xl font-black text-success mt-1" dir="ltr">
            $0.42
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-xs text-muted-foreground">نسبة الهدية من المنصة</div>
          <div className="text-2xl font-black text-primary mt-1">10% مدى الحياة</div>
        </div>
      </div>
    </div>
  );
}

/* ========================= AUCTIONS PAGE ========================= */
export function AuctionsPage() {
  const { state, placeAuctionBid } = useApp();
  const [bidError, setBidError] = useState<Record<string, string>>({});

  if (!state.user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="سوق ومزاد الإحالات"
          subtitle="اعرض المدعوين بتوعك للبيع، أو زايد على إحالات نشيطة وخد عمولة مهامهم من لحظة رسو المزاد."
        />
        <AuthGateCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="سوق ومزاد الإحالات"
        subtitle="اعرض المدعوين بتوعك للبيع، أو زايد على إحالات نشيطة وخد عمولة مهامهم من لحظة رسو المزاد."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.auctions.map((auc) => {
          const nextBid = Number((auc.currentBid + auc.minIncrement).toFixed(2));
          return (
            <article
              key={auc.id}
              className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between gap-4 tfa-shadow-card"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-secondary text-primary text-xs font-extrabold" dir="ltr">
                    {auc.referralCode}
                  </span>
                  <span className="text-xs text-muted-foreground">ينتهي خلال {auc.endsIn}</span>
                </div>
                <div className="text-xs text-muted-foreground">البائع: {auc.seller}</div>
                <div className="grid grid-cols-2 gap-2 text-xs bg-background rounded-xl p-3 border border-border">
                  <div>
                    <div className="text-muted-foreground">المهام المنجزة</div>
                    <div className="font-extrabold mt-0.5">{auc.tasksCompleted}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">نشاط شهري</div>
                    <div className="font-extrabold text-success mt-0.5" dir="ltr">
                      ${auc.monthlyEarnings.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">أعلى مزايدة ({auc.bidsCount})</span>
                  <span className="text-lg font-black text-primary" dir="ltr">
                    ${auc.currentBid.toFixed(2)}
                  </span>
                </div>
                {bidError[auc.id] && (
                  <div className="text-[11px] font-bold text-destructive">{bidError[auc.id]}</div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const res = placeAuctionBid(auc.id, nextBid);
                    if (!res.ok) {
                      setBidError((prev) => ({ ...prev, [auc.id]: res.error || 'خطأ' }));
                    } else {
                      setBidError((prev) => ({ ...prev, [auc.id]: '' }));
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-xs inline-flex items-center justify-center gap-1.5"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>زايد بمبلغ ${nextBid.toFixed(2)}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
