import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import { GOOGLE_PLAY_URL } from '../data/siteContent';

export function BrandMark({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="/assets/brand-mark.webp"
      alt=""
      width={size}
      height={size}
      className={`object-contain aspect-square shrink-0 ${className}`}
    />
  );
}

export function GooglePlayBadge({ className = '' }: { className?: string }) {
  return (
    <a
      href={GOOGLE_PLAY_URL}
      target="_blank"
      rel="noopener noreferrer"
      dir="ltr"
      aria-label="حمّل تطبيق تفاعل من Google Play"
      className={`inline-flex items-center justify-center gap-2.5 bg-black text-white rounded-xl px-4 py-2 border border-white/15 hover:opacity-90 transition-opacity ${className}`}
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
        <path fill="#00D2FF" d="M3.6 2.3c-.3.3-.5.8-.5 1.4v16.6c0 .6.2 1.1.5 1.4l.1.1 9.3-9.3v-.2L3.7 2.2l-.1.1z" />
        <path fill="#00F076" d="M16.1 15.6l-3.1-3.1v-.2l3.1-3.1.1.1 3.7 2.1c1.1.6 1.1 1.6 0 2.2l-3.7 2.1-.1-.1z" />
        <path fill="#FF3A44" d="M16.2 15.5L13 12.3 3.6 21.7c.4.4 1 .4 1.7 0l10.9-6.2z" />
        <path fill="#FFC900" d="M16.2 9.1L5.3 2.9c-.7-.4-1.3-.4-1.7 0L13 12.3l3.2-3.2z" />
      </svg>
      <div className="flex flex-col leading-tight text-left">
        <span className="text-[10px] text-white/80 font-medium" dir="rtl">
          احصل عليه من
        </span>
        <span className="text-[15px] font-bold tracking-tight">Google Play</span>
      </div>
    </a>
  );
}

export function AuthGateCard({
  title = 'مساحتك تبدأ بحساب',
  subtitle = 'سجّل دخولك لإضافة حساب TikTok ومتابعة حملاتك وأرباحك.',
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-10 text-center tfa-shadow-card">
      <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground mx-auto mb-4 flex items-center justify-center">
        <LogIn className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-extrabold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">{subtitle}</p>
      <Link
        to="/auth"
        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-bold text-sm px-6 py-2.5 rounded-xl tfa-shadow-primary transition-colors"
      >
        تسجيل الدخول
      </Link>
    </div>
  );
}

export function AntiUnfollowNotice() {
  return (
    <div className="bg-warning-soft border border-warning/25 rounded-2xl px-4 py-3.5 flex items-center gap-3 text-sm text-warning font-medium">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <span>
        لا تلغِ المتابعة أو تُزل الإعجاب بعد حصولك على المكافأة. تكرار عكس التفاعل قد يؤدي إلى تعليق حسابك أو إنهائه بعد المراجعة.
      </span>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-[28px] font-extrabold text-foreground leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function TrustBadgePill() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success-soft border border-success/20 text-success text-sm font-bold">
      <ShieldCheck className="w-4 h-4" />
      <span>آمن وشفاف</span>
    </div>
  );
}
