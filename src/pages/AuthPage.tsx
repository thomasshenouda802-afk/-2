import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Check, Puzzle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/SharedUI';
import { validatePassword } from '../utils/platformLogic';

type AuthMode = 'login' | 'signup' | 'forgot';

export function AuthPage() {
  const { state, login, showToast } = useApp();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(0);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const captchaTarget = 78;
  const captchaSolved = Math.abs(captchaValue - captchaTarget) <= 10;
  const pwdCheck = validatePassword(password);

  if (state.user) {
    return (
      <div className="max-w-md mx-auto py-8">
        <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4 tfa-shadow-card">
          <div className="flex items-center justify-center gap-2">
            <BrandMark size={34} />
            <span className="text-2xl font-black">تفاعل</span>
          </div>
          <h1 className="text-xl font-extrabold">أنت مسجّل الدخول بالفعل</h1>
          <p className="text-sm text-muted-foreground">
            مرحبًا بك يا {state.user.name} ({state.user.email})
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/earn"
              className="bg-primary text-primary-foreground font-bold text-sm px-5 py-2.5 rounded-xl"
            >
              اذهب إلى المهام
            </Link>
            <Link
              to="/wallet"
              className="bg-muted text-foreground font-bold text-sm px-5 py-2.5 rounded-xl"
            >
              المحفظة
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('أدخل بريدًا إلكترونيًا صحيحًا.');
      return;
    }
    if (password.length < 4) {
      setError('أدخل كلمة المرور.');
      return;
    }
    login(email.trim());
    navigate('/earn');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('اكتب اسمك أولًا.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('أدخل بريدًا إلكترونيًا صحيحًا.');
      return;
    }
    if (!pwdCheck.isValid) {
      setError('كلمة المرور لا تستوفي جميع الشروط المطلوبة.');
      return;
    }
    if (!captchaSolved) {
      setError('اسحب القطعة إلى المكان الفاضي لإكمال التحقق.');
      return;
    }
    if (!agreeTerms) {
      setError('يجب الموافقة على شروط الاستخدام وسياسة الخصوصية.');
      return;
    }
    login(email.trim(), name.trim());
    navigate('/earn');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('أدخل بريدك الإلكتروني المسجّل.');
      return;
    }
    setForgotSent(true);
    showToast('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك', 'success');
  };

  const handleGoogleContinue = () => {
    login('ahmed.member@gmail.com', 'أحمد محمود');
    navigate('/earn');
  };

  return (
    <div className="max-w-[460px] mx-auto py-4">
      <div className="bg-card border border-border rounded-[22px] p-7 sm:p-8 tfa-shadow-card">
        {/* Logo */}
        <Link
          to="/"
          aria-label="تفاعل، الرئيسية"
          className="flex items-center justify-center gap-2.5 mb-5"
        >
          <BrandMark size={34} />
          <span className="text-2xl font-black text-foreground">تفاعل</span>
        </Link>

        {mode === 'login' && (
          <>
            <h1 className="text-2xl font-black text-center text-foreground">أهلًا برجوعك</h1>
            <p className="text-sm text-muted-foreground text-center mt-1 mb-6">
              حساب واحد للكسب وإدارة حملاتك.
            </p>

            {error && (
              <div
                role="alert"
                className="mb-4 px-3.5 py-2.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-bold"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="auth-email" className="block text-xs font-bold text-foreground mb-1.5">
                  البريد الإلكتروني
                </label>
                <input
                  id="auth-email"
                  type="email"
                  dir="ltr"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm text-foreground text-left focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="auth-password" className="block text-xs font-bold text-foreground mb-1.5">
                  كلمة المرور
                </label>
                <input
                  id="auth-password"
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm text-foreground text-left focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 tfa-shadow-primary transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-border" />
              <span>أو</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <p className="text-xs text-muted-foreground text-center leading-relaxed mb-3">
              بالمتابعة باستخدام Google لإنشاء حساب جديد، فإنك توافق على{' '}
              <Link to="/terms" className="text-primary hover:underline font-medium">
                شروط الاستخدام وإخلاء المسؤولية
              </Link>{' '}
              و
              <Link to="/privacy" className="text-primary hover:underline font-medium">
                سياسة الخصوصية
              </Link>
              .
            </p>

            <button
              type="button"
              onClick={handleGoogleContinue}
              className="w-full h-11 rounded-xl bg-muted hover:bg-secondary/70 border border-border text-foreground font-bold text-sm flex items-center justify-center gap-2.5 transition-colors"
            >
              <span className="font-black text-base">G</span>
              <span>المتابعة باستخدام Google</span>
            </button>

            <div className="mt-5 flex items-center justify-center gap-5 text-xs font-bold text-primary">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setMode('signup');
                }}
                className="hover:underline"
              >
                جديد هنا؟ أنشئ حسابك
              </button>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setForgotSent(false);
                  setMode('forgot');
                }}
                className="hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
          </>
        )}

        {mode === 'signup' && (
          <>
            <h1 className="text-2xl font-black text-center text-foreground">ابدأ رحلتك مع تفاعل</h1>
            <p className="text-sm text-muted-foreground text-center mt-1 mb-6">
              حساب واحد للكسب وإدارة حملاتك.
            </p>

            {error && (
              <div
                role="alert"
                className="mb-4 px-3.5 py-2.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-bold"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="block text-xs font-bold text-foreground mb-1.5">
                  اسمك
                </label>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="الاسم الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-xs font-bold text-foreground mb-1.5">
                  البريد الإلكتروني
                </label>
                <input
                  id="signup-email"
                  type="email"
                  dir="ltr"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm text-foreground text-left focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-xs font-bold text-foreground mb-1.5">
                  كلمة المرور
                </label>
                <input
                  id="signup-password"
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm text-foreground text-left focus:outline-none focus:border-primary"
                />

                <div className="mt-2.5 p-3 rounded-xl bg-muted/60 border border-border text-xs space-y-1">
                  <div className="font-bold text-foreground mb-1">شروط كلمة المرور:</div>
                  <PwdRule ok={pwdCheck.minLength} text="8 حروف على الأقل" />
                  <PwdRule ok={pwdCheck.hasEnglishLetter} text="حرف إنجليزي واحد على الأقل" />
                  <PwdRule ok={pwdCheck.hasDigit} text="رقم واحد على الأقل" />
                  <PwdRule ok={pwdCheck.hasSymbol} text="رمز واحد على الأقل مثل ! @ #" />
                </div>
              </div>

              {/* Interactive Slide Puzzle Captcha */}
              <div className="p-3.5 rounded-xl bg-muted/50 border border-border space-y-2.5">
                <div className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>خطوة أخيرة: اسحب الزر تحت لليمين لحد ما القطعة تدخل في المكان الفاضي</span>
                  {captchaSolved && (
                    <span className="text-success font-extrabold inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> تم التحقق
                    </span>
                  )}
                </div>
                <div
                  dir="ltr"
                  className="relative h-14 rounded-xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--brand-2))',
                  }}
                >
                  {/* Target slot */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg border-2 border-dashed border-white/80 bg-black/35 flex items-center justify-center"
                    style={{ left: `${captchaTarget}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <Puzzle className="w-4 h-4 text-white/60" />
                  </div>
                  {/* Movable piece */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg border-2 flex items-center justify-center shadow-md transition-colors ${
                      captchaSolved
                        ? 'bg-success border-white text-white'
                        : 'bg-white/95 border-white text-primary'
                    }`}
                    style={{
                      left: `${Math.max(10, Math.min(90, captchaValue))}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {captchaSolved ? <Check className="w-5 h-5" /> : <Puzzle className="w-5 h-5" />}
                  </div>
                </div>
                <div dir="ltr" className="flex items-center gap-2">
                  <input
                    type="range"
                    aria-label="اسحب الزر للتحقق"
                    min={10}
                    max={90}
                    value={captchaValue || 10}
                    onChange={(e) => setCaptchaValue(Number(e.target.value))}
                    className="w-full accent-[var(--primary)] cursor-pointer"
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-center">
                  {captchaSolved ? 'تم مطابقة القطعة بنجاح ✓' : 'اسحب الزر من هنا ←'}
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 accent-[var(--primary)]"
                />
                <span>
                  أوافق على{' '}
                  <Link to="/terms" className="text-primary hover:underline font-bold">
                    شروط الاستخدام وإخلاء المسؤولية
                  </Link>{' '}
                  و
                  <Link to="/privacy" className="text-primary hover:underline font-bold">
                    سياسة الخصوصية
                  </Link>
                  .
                </span>
              </label>

              <p className="text-[11px] text-muted-foreground bg-secondary/50 rounded-xl p-2.5 leading-relaxed">
                لو رسالة التفعيل موصلتش خلال 5 دقايق، اضغط «المتابعة باستخدام Google» تحت — حسابك
                بيتفعّل على طول من غير رسالة.
              </p>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-sm tfa-shadow-primary transition-colors"
              >
                إنشاء حساب
              </button>
            </form>

            <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-border" />
              <span>أو</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              type="button"
              onClick={handleGoogleContinue}
              className="w-full h-11 rounded-xl bg-muted hover:bg-secondary/70 border border-border text-foreground font-bold text-sm flex items-center justify-center gap-2.5 transition-colors"
            >
              <span className="font-black text-base">G</span>
              <span>المتابعة باستخدام Google</span>
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setMode('login');
                }}
                className="text-xs font-bold text-primary hover:underline"
              >
                عندك حساب؟ سجّل الدخول
              </button>
            </div>
          </>
        )}

        {mode === 'forgot' && (
          <>
            <h1 className="text-2xl font-black text-center text-foreground">استعادة كلمة المرور</h1>
            <p className="text-sm text-muted-foreground text-center mt-1 mb-6">
              اكتب بريدك الإلكتروني وهنبعتلك رابط لإعادة تعيين كلمة المرور.
            </p>

            {error && (
              <div
                role="alert"
                className="mb-4 px-3.5 py-2.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-bold"
              >
                {error}
              </div>
            )}

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-success-soft border border-success/25 text-success text-sm font-bold text-center space-y-2">
                <p>تم إرسال رابط إعادة تعيين كلمة المرور إلى {email}</p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs underline"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block text-xs font-bold text-foreground mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    dir="ltr"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm text-foreground text-left focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-sm tfa-shadow-primary"
                >
                  إرسال رابط الاستعادة
                </button>
              </form>
            )}

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setMode('login');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>رجوع لتسجيل الدخول</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PwdRule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${ok ? 'text-success font-bold' : 'text-muted-foreground'}`}>
      <span>{ok ? '✓' : '•'}</span>
      <span>{text}</span>
    </div>
  );
}
