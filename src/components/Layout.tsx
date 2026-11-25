import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Zap,
  Compass,
  Music2,
  Youtube,
  Instagram,
  Wallet,
  ArrowUpRight,
  Store,
  Briefcase,
  MessageCircle,
  Users,
  Gavel,
  Megaphone,
  Trophy,
  Award,
  Medal,
  Sparkles,
  LifeBuoy,
  BookOpen,
  Bell,
  Moon,
  Sun,
  Search,
  LogIn,
  ChevronDown,
  ChevronLeft,
  PanelRightClose,
  PanelRightOpen,
  Menu,
  X,
  User,
  Radio,
  LogOut,
  CheckCircle2,
  Heart,
  Repeat2,
  UserPlus,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  FACEBOOK_GROUP_URL,
  SITE_DIRECTORY,
  TELEGRAM_GROUP_URL,
} from '../data/siteContent';
import { calculateMemberRank, searchSiteDirectory } from '../utils/platformLogic';
import { BrandMark, GooglePlayBadge, TrustBadgePill } from './SharedUI';

const ROUTE_META: Record<string, { breadcrumb: string; title: string }> = {
  '/': { breadcrumb: 'الرئيسية', title: 'مهام رقمية مدفوعة واستكشاف محتوى — تفاعل' },
  '/auth': { breadcrumb: 'تفاعل', title: 'تسجيل الدخول — تفاعل' },
  '/earn': { breadcrumb: 'اكسب المال', title: 'اكسب من المهام — تفاعل' },
  '/earn/all': { breadcrumb: 'تيك توك', title: 'مهام تيك توك — تفاعل' },
  '/start': { breadcrumb: 'خطة البدء', title: 'خطة البدء — تفاعل' },
  '/accounts': { breadcrumb: 'حسابات TikTok', title: 'حسابات TikTok — تفاعل' },
  '/youtube': { breadcrumb: 'مشتركين يوتيوب', title: 'مهام يوتيوب — تفاعل' },
  '/instagram': { breadcrumb: 'متابعات إنستجرام', title: 'مهام إنستجرام — تفاعل' },
  '/twitter': { breadcrumb: 'تفاعل', title: 'مهام X — تفاعل' },
  '/partner-offers': { breadcrumb: 'عروض الشركاء', title: 'عروض الشركاء — تفاعل' },
  '/wallet': { breadcrumb: 'المحفظة', title: 'المحفظة — تفاعل' },
  '/withdraw': { breadcrumb: 'سحب الأرباح', title: 'سحب الأرباح — تفاعل' },
  '/exchange': { breadcrumb: 'التجار المعتمدون', title: 'التجار المعتمدون — تفاعل' },
  '/reseller': { breadcrumb: 'لوحة الريسيلر', title: 'لوحة الريسيلر — تفاعل' },
  '/reseller/chat': { breadcrumb: 'محادثات التجار', title: 'محادثات التجار — تفاعل' },
  '/referrals': { breadcrumb: 'دعوة الأصدقاء', title: 'دعوة الأصدقاء — تفاعل' },
  '/auctions': { breadcrumb: 'مزاد الإحالات', title: 'مزاد الإحالات — تفاعل' },
  '/campaigns/new': { breadcrumb: 'تفاعل', title: 'حملة جديدة — تفاعل' },
  '/campaigns': { breadcrumb: 'حملاتي', title: 'حملاتي — تفاعل' },
  '/ranks': { breadcrumb: 'رتب الأعضاء', title: 'رتب الأعضاء وامتيازاتها في تفاعل — تفاعل' },
  '/contests': { breadcrumb: 'المسابقات', title: 'المسابقات — تفاعل' },
  '/records': { breadcrumb: 'الأرقام القياسية', title: 'الأرقام القياسية — تفاعل' },
  '/assistant': { breadcrumb: 'مساعد ذكي', title: 'مساعد ذكي — تفاعل' },
  '/support': { breadcrumb: 'المساعدة والدعم', title: 'المساعدة والدعم — تفاعل' },
  '/guide': { breadcrumb: 'دليل الاستخدام', title: 'دليل الكسب وحملات تيك توك — تفاعل' },
  '/updates': { breadcrumb: 'التحديثات', title: 'التحديثات — تفاعل' },
  '/terms': { breadcrumb: 'الشروط والأحكام', title: 'الشروط والأحكام — تفاعل' },
  '/privacy': { breadcrumb: 'الخصوصية', title: 'سياسة الخصوصية لتطبيق وموقع تفاعل — تفاعل' },
  '/en/terms': { breadcrumb: 'Terms', title: 'Terms of Service (English) — تفاعل' },
  '/en/privacy': { breadcrumb: 'Privacy', title: 'Privacy Policy (English) — تفاعل' },
  '/delete-account': { breadcrumb: 'حذف الحساب', title: 'حذف الحساب — تفاعل' },
  '/partner': { breadcrumb: 'تفاعل', title: 'كن شريكًا معنا — غطّ الدفع المحلي في بلدك واربح من سوق التبادل' },
  '/profile': { breadcrumb: 'حسابي', title: 'حسابي — تفاعل' },
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { state, toggleDarkMode, dismissBanner, logout, toasts, markAllNotificationsRead } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    earn: true,
    money: false,
    referrals: false,
    advertisers: false,
    achievements: false,
    help: false,
  });

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const meta =
    ROUTE_META[location.pathname] ||
    (location.pathname.startsWith('/contests/')
      ? { breadcrumb: 'المسابقات', title: 'تفاصيل المسابقة — تفاعل' }
      : { breadcrumb: 'تفاعل', title: 'تفاعل' });

  useEffect(() => {
    document.title = meta.title;
  }, [meta.title]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setNotifOpen(false);
    setSearchFocused(false);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname, location.search]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const toggleGroup = (key: string) => {
    if (collapsed) setCollapsed(false);
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const searchResults = searchSiteDirectory(SITE_DIRECTORY, searchQuery);
  const unreadCount = state.notifications.filter((n) => !n.read).length;
  const rank = state.user
    ? calculateMemberRank(state.user.trustPoints, state.user.cleanWithdrawals)
    : null;

  const sidebarNavContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Brand header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <Link
          to="/"
          aria-label="تفاعل، الرئيسية"
          className="flex items-center gap-2.5 text-foreground"
        >
          <BrandMark size={34} />
          {(!collapsed || isMobile) && (
            <span className="text-[28px] font-black leading-none tracking-normal">تفاعل</span>
          )}
        </Link>
        {isMobile && (
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="إغلاق القائمة"
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Account Box */}
      <div className="px-3 py-3 border-b border-border">
        {state.user ? (
          <Link
            to="/profile"
            className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/70 hover:bg-secondary transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold shrink-0">
              {state.user.name.charAt(0).toUpperCase()}
            </div>
            {(!collapsed || isMobile) && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-sm font-bold text-foreground truncate">
                  <span className="truncate">{state.user.name}</span>
                  <span>{rank?.emoji}</span>
                </div>
                <div className="text-xs text-primary font-bold text-right" dir="ltr">
                  ${state.user.availableBalance.toFixed(2)}
                </div>
              </div>
            )}
            {(!collapsed || isMobile) && (
              <ChevronLeft className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
          </Link>
        ) : (
          <Link
            to="/auth"
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/70 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0">
              <LogIn className="w-4 h-4" />
            </div>
            {(!collapsed || isMobile) && (
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-foreground leading-tight">تسجيل الدخول</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">أهلًا بيك في تفاعل</div>
              </div>
            )}
            {(!collapsed || isMobile) && (
              <ChevronLeft className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
          </Link>
        )}
      </div>

      {/* Scrollable Navigation */}
      <nav aria-label="القائمة الجانبية" className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {/* الرئيسية */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
              isActive
                ? 'bg-secondary text-primary font-bold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-card text-primary shadow-xs' : 'text-muted-foreground'
                }`}
              >
                <Home className="w-4 h-4" />
              </span>
              {(!collapsed || isMobile) && <span className="flex-1">الرئيسية</span>}
              {(!collapsed || isMobile) && isActive && <ChevronLeft className="w-4 h-4" />}
            </>
          )}
        </NavLink>

        {/* الشغل والربح */}
        <div>
          <button
            type="button"
            aria-expanded={openGroups.earn}
            onClick={() => toggleGroup('earn')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-success-soft text-success flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </span>
            {(!collapsed || isMobile) && (
              <>
                <span className="flex-1 text-right">الشغل والربح</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    openGroups.earn ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </button>
          {(!collapsed || isMobile) && openGroups.earn && (
            <div className="mt-1 mr-4 pr-3 border-r border-border space-y-0.5">
              <SidebarSubLink to="/earn" icon={<Zap className="w-4 h-4" />} label="اكسب المال" accent />
              <SidebarSubLink to="/start" icon={<Compass className="w-4 h-4" />} label="خطة البدء" />
              <SidebarSubLink to="/accounts" icon={<Music2 className="w-4 h-4" />} label="حسابات TikTok" />
              <SidebarSubLink to="/youtube" icon={<Youtube className="w-4 h-4" />} label="مشتركين يوتيوب" />
              <SidebarSubLink to="/instagram" icon={<Instagram className="w-4 h-4" />} label="متابعات إنستجرام" />
              <SidebarSubLink to="/partner-offers" icon={<Compass className="w-4 h-4" />} label="عروض الشركاء" />
            </div>
          )}
        </div>

        {/* فلوسي */}
        <div>
          <button
            type="button"
            aria-expanded={openGroups.money}
            onClick={() => toggleGroup('money')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-secondary text-primary flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </span>
            {(!collapsed || isMobile) && (
              <>
                <span className="flex-1 text-right">فلوسي</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    openGroups.money ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </button>
          {(!collapsed || isMobile) && openGroups.money && (
            <div className="mt-1 mr-4 pr-3 border-r border-border space-y-0.5">
              <SidebarSubLink to="/wallet" icon={<Wallet className="w-4 h-4" />} label="المحفظة" />
              <SidebarSubLink to="/withdraw" icon={<ArrowUpRight className="w-4 h-4" />} label="سحب الأرباح" />
              <SidebarSubLink to="/exchange" icon={<Store className="w-4 h-4" />} label="التجار المعتمدون" />
              <SidebarSubLink to="/reseller" icon={<Briefcase className="w-4 h-4" />} label="لوحة الريسيلر" />
              <SidebarSubLink to="/reseller/chat" icon={<MessageCircle className="w-4 h-4" />} label="محادثات التجار" />
            </div>
          )}
        </div>

        {/* الدعوات والمزاد */}
        <div>
          <button
            type="button"
            aria-expanded={openGroups.referrals}
            onClick={() => toggleGroup('referrals')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </span>
            {(!collapsed || isMobile) && (
              <>
                <span className="flex-1 text-right">الدعوات والمزاد</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    openGroups.referrals ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </button>
          {(!collapsed || isMobile) && openGroups.referrals && (
            <div className="mt-1 mr-4 pr-3 border-r border-border space-y-0.5">
              <SidebarSubLink to="/referrals" icon={<Users className="w-4 h-4" />} label="دعوة الأصدقاء" />
              <SidebarSubLink to="/auctions" icon={<Gavel className="w-4 h-4" />} label="مزاد الإحالات" />
            </div>
          )}
        </div>

        {/* للمعلنين + حملاتي */}
        <div>
          <button
            type="button"
            aria-expanded={openGroups.advertisers}
            onClick={() => toggleGroup('advertisers')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-secondary text-primary flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4" />
            </span>
            {(!collapsed || isMobile) && (
              <>
                <span className="flex-1 text-right">للمعلنين</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    openGroups.advertisers ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </button>
          {(!collapsed || isMobile) && openGroups.advertisers && (
            <div className="mt-1 mr-4 pr-3 border-r border-border space-y-2 py-1">
              <div>
                <div className="text-[11px] font-bold text-muted-foreground px-2 mb-1">تيك توك</div>
                <SidebarSubLink to="/campaigns/new?service=follow" icon={<UserPlus className="w-3.5 h-3.5" />} label="متابعات" />
                <SidebarSubLink to="/campaigns/new?service=like" icon={<Heart className="w-3.5 h-3.5" />} label="إعجابات" />
                <SidebarSubLink to="/campaigns/new?service=comment" icon={<MessageSquare className="w-3.5 h-3.5" />} label="تعليقات" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-muted-foreground px-2 mb-1">يوتيوب</div>
                <SidebarSubLink to="/campaigns/new?service=yt_subscribe" icon={<Youtube className="w-3.5 h-3.5" />} label="اشتراكات" />
                <SidebarSubLink to="/campaigns/new?service=yt_comment" icon={<MessageSquare className="w-3.5 h-3.5" />} label="تعليقات" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-muted-foreground px-2 mb-1">إنستجرام</div>
                <SidebarSubLink to="/campaigns/new?service=ig_follow" icon={<UserPlus className="w-3.5 h-3.5" />} label="متابعات" />
                <SidebarSubLink to="/campaigns/new?service=ig_like" icon={<Heart className="w-3.5 h-3.5" />} label="إعجابات" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-muted-foreground px-2 mb-1">X</div>
                <SidebarSubLink to="/campaigns/new?service=twitter_follow" icon={<UserPlus className="w-3.5 h-3.5" />} label="متابعات" />
                <SidebarSubLink to="/campaigns/new?service=twitter_retweet" icon={<Repeat2 className="w-3.5 h-3.5" />} label="إعادة نشر" />
                <SidebarSubLink to="/campaigns/new?service=twitter_reply" icon={<MessageSquare className="w-3.5 h-3.5" />} label="تعليقات" />
              </div>
            </div>
          )}

          <NavLink
            to="/campaigns"
            end
            className={({ isActive }) =>
              `mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-secondary text-primary font-bold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground font-medium'
              }`
            }
          >
            <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4" />
            </span>
            {(!collapsed || isMobile) && <span className="flex-1">حملاتي</span>}
          </NavLink>
        </div>

        {/* الإنجازات */}
        <div>
          <button
            type="button"
            aria-expanded={openGroups.achievements}
            onClick={() => toggleGroup('achievements')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-warning-soft text-warning flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </span>
            {(!collapsed || isMobile) && (
              <>
                <span className="flex-1 text-right">الإنجازات</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    openGroups.achievements ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </button>
          {(!collapsed || isMobile) && openGroups.achievements && (
            <div className="mt-1 mr-4 pr-3 border-r border-border space-y-0.5">
              <SidebarSubLink to="/ranks" icon={<Medal className="w-4 h-4" />} label="رتب الأعضاء" />
              <SidebarSubLink to="/contests" icon={<Trophy className="w-4 h-4" />} label="المسابقات" />
              <SidebarSubLink to="/records" icon={<Award className="w-4 h-4" />} label="الأرقام القياسية" />
            </div>
          )}
        </div>

        {/* المساعدة */}
        <div>
          <button
            type="button"
            aria-expanded={openGroups.help}
            onClick={() => toggleGroup('help')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-secondary text-primary flex items-center justify-center shrink-0">
              <LifeBuoy className="w-4 h-4" />
            </span>
            {(!collapsed || isMobile) && (
              <>
                <span className="flex-1 text-right">المساعدة</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    openGroups.help ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </button>
          {(!collapsed || isMobile) && openGroups.help && (
            <div className="mt-1 mr-4 pr-3 border-r border-border space-y-0.5">
              <SidebarSubLink to="/assistant" icon={<Sparkles className="w-4 h-4" />} label="مساعد ذكي" />
              <SidebarSubLink to="/support" icon={<LifeBuoy className="w-4 h-4" />} label="المساعدة والدعم" />
              <SidebarSubLink to="/guide" icon={<BookOpen className="w-4 h-4" />} label="دليل الاستخدام" />
              <SidebarSubLink to="/updates" icon={<Radio className="w-4 h-4" />} label="التحديثات" />
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Google Play & Dark mode toggle */}
      <div className="p-3 border-t border-border space-y-3 bg-card">
        {(!collapsed || isMobile) && <GooglePlayBadge className="w-full" />}
        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label={state.darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
          className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-2">
            {state.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {(!collapsed || isMobile) && (
              <span>{state.darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
            )}
          </span>
          {(!collapsed || isMobile) && (
            <span
              className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                state.darkMode ? 'bg-primary justify-end' : 'bg-border justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-card shadow-xs block" />
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Right Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 bottom-0 right-0 z-30 bg-card border-l border-border transition-all duration-200 ${
          collapsed ? 'w-[76px]' : 'w-[244px]'
        }`}
      >
        {sidebarNavContent(false)}
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[var(--overlay)]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="absolute top-0 bottom-0 right-0 w-[272px] bg-card border-l border-border shadow-xl">
            {sidebarNavContent(true)}
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div
        className={`flex-1 min-w-0 flex flex-col min-h-screen transition-all duration-200 ${
          collapsed ? 'lg:mr-[76px]' : 'lg:mr-[244px]'
        }`}
      >
        {/* Top Announcement Banner */}
        {!state.bannerDismissed && (
          <div className="bg-secondary/80 border-b border-border px-4 py-2.5">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-foreground/90 font-medium">
                <Users className="w-4 h-4 text-primary shrink-0" />
                <span>
                  انضم لجروب الفيسبوك الجديد بتاعنا للأسئلة والاستفسارات — ممنوع نشر رابط المنصة فيه.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={FACEBOOK_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  انضم للجروب
                </a>
                <button
                  type="button"
                  onClick={dismissBanner}
                  aria-label="إغلاق الإعلان"
                  className="p-1 text-muted-foreground hover:text-foreground rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Topbar Header */}
        <header className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border h-[68px] lg:h-[74px] px-4 lg:px-7 flex items-center justify-between gap-3">
          {/* Desktop Left/Right side (Start in RTL) */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger + Brand */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="فتح القائمة"
              className="lg:hidden p-2 rounded-lg hover:bg-muted text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <BrandMark size={28} />
              <span className="text-xl font-black text-foreground">تفاعل</span>
            </Link>

            {/* Desktop Collapse Toggle + Breadcrumb */}
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
              className="hidden lg:inline-flex p-2 rounded-lg hover:bg-muted text-foreground transition-colors"
            >
              {collapsed ? (
                <PanelRightOpen className="w-5 h-5" />
              ) : (
                <PanelRightClose className="w-5 h-5" />
              )}
            </button>
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <span className="font-bold text-foreground">{meta.breadcrumb}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">مساحتك</span>
            </div>
          </div>

          {/* End in RTL: Search + Theme + Notifications + Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search */}
            <div ref={searchBoxRef} className="hidden md:block relative w-[260px] xl:w-[300px]">
              <Search className="w-4 h-4 text-primary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                aria-label="ابحث في تفاعل"
                placeholder="ابحث عن صفحة أو خدمة..."
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    navigate(searchResults[0].path);
                    setSearchQuery('');
                    setSearchFocused(false);
                  }
                }}
                className="w-full h-10 pr-9 pl-3 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              {searchFocused && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-card border border-border rounded-xl shadow-lg overflow-hidden z-40">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      لا توجد نتائج مطابقة لـ «{searchQuery}»
                    </div>
                  ) : (
                    <ul className="py-1.5 max-h-72 overflow-y-auto">
                      {searchResults.map((item) => (
                        <li key={item.path}>
                          <button
                            type="button"
                            onClick={() => {
                              navigate(item.path);
                              setSearchQuery('');
                              setSearchFocused(false);
                            }}
                            className="w-full text-right px-3.5 py-2 hover:bg-muted flex items-center justify-between gap-2 transition-colors"
                          >
                            <div>
                              <div className="text-sm font-bold text-foreground">{item.title}</div>
                              <div className="text-[11px] text-muted-foreground">{item.subtitle}</div>
                            </div>
                            <ChevronLeft className="w-4 h-4 text-muted-foreground shrink-0" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="بحث"
              className="md:hidden p-2 rounded-xl hover:bg-muted text-foreground"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={state.darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              className="p-2 rounded-xl hover:bg-muted text-foreground transition-colors"
            >
              {state.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div ref={notifRef} className="relative hidden sm:block">
              <button
                type="button"
                aria-label="الإشعارات"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 rounded-xl hover:bg-muted text-foreground transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute left-0 top-[calc(100%+8px)] w-80 bg-card border border-border rounded-2xl shadow-xl z-40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <span className="font-bold text-sm">الإشعارات</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        تحديد الكل كمقروء
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-border max-h-72 overflow-y-auto">
                    {state.notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 text-right ${n.read ? '' : 'bg-secondary/40'}`}
                      >
                        <div className="text-xs font-bold text-foreground">{n.title}</div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                        <div className="text-[10px] text-muted-foreground mt-1">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:block w-px h-6 bg-border" />

            {/* Auth / Account pill */}
            {state.user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/wallet"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-primary font-extrabold text-xs sm:text-sm hover:opacity-90"
                  dir="ltr"
                >
                  ${state.user.availableBalance.toFixed(2)}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  aria-label="تسجيل الخروج"
                  title="تسجيل الخروج"
                  className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-sm font-bold transition-colors"
              >
                <LogIn className="w-4 h-4 hidden sm:block" />
                <span>دخول</span>
              </Link>
            )}
          </div>
        </header>

        {/* Mobile Search Overlay */}
        {mobileSearchOpen && (
          <div className="fixed inset-0 z-50 bg-[var(--overlay)] p-4 md:hidden flex items-start justify-center pt-16">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-primary" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن صفحة أو خدمة..."
                  className="flex-1 bg-transparent text-sm outline-none text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(false)}
                  aria-label="إغلاق البحث"
                  className="p-1 text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-border max-h-64 overflow-y-auto">
                {searchResults.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      setMobileSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-right py-2.5 px-2 hover:bg-muted rounded-lg"
                  >
                    <div className="text-sm font-bold">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area + Shared Footer */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10 max-w-[1160px] w-full mx-auto">
          {children}

          {/* Shared Footer Card */}
          <footer className="mt-12 bg-card border border-border rounded-2xl px-6 py-7 tfa-shadow-card">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Brand & Copyright */}
              <div className="flex flex-col items-center md:items-start gap-2">
                <Link to="/" className="flex items-center gap-2">
                  <BrandMark size={28} />
                  <span className="text-xl font-black text-foreground">تفاعل</span>
                </Link>
                <p className="text-xs text-muted-foreground">
                  © 2026 تفاعل. كل تفاعل يصنع فرقًا.
                </p>
              </div>

              {/* Footer Links Grid */}
              <nav
                aria-label="روابط الفوتر"
                className="grid grid-cols-2 gap-x-10 gap-y-2 text-xs sm:text-[13px] text-muted-foreground"
              >
                <FooterLink to="/terms" label="الشروط والأحكام" />
                <FooterLink to="/privacy" label="الخصوصية" />
                <FooterLink to="/en/terms" label="Terms (English)" />
                <FooterLink to="/en/privacy" label="Privacy (English)" />
                <FooterLink to="/delete-account" label="حذف الحساب" />
                <FooterLink to="/guide" label="دليل الاستخدام" />
                <FooterLink to="/partner" label="كن شريكًا معنا" />
                <FooterLink to="/support" label="الدعم" />
                <a
                  href={FACEBOOK_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <span className="text-border">•</span>
                  <span>جروب الفيسبوك</span>
                </a>
                <a
                  href={TELEGRAM_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <span className="text-border">•</span>
                  <span>جروب تليجرام</span>
                </a>
                <Link
                  to="/support?report=bug"
                  className="text-destructive hover:underline font-medium flex items-center gap-1.5"
                >
                  <span>•</span>
                  <span>الإبلاغ عن مشكلة</span>
                </Link>
              </nav>

              {/* Safe Badge */}
              <TrustBadgePill />
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="التنقل الرئيسي"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-card/95 backdrop-blur-md border-t border-border px-2 py-1.5 flex items-end justify-around"
      >
        <MobileBottomLink to="/" icon={<Home className="w-5 h-5" />} label="الرئيسية" end />
        <MobileBottomLink to="/wallet" icon={<Wallet className="w-5 h-5" />} label="المحفظة" />
        <Link to="/earn" className="flex flex-col items-center -mt-4">
          <span className="w-12 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center tfa-shadow-primary">
            <Zap className="w-5 h-5" />
          </span>
          <span className="text-[11px] font-bold text-primary mt-1">اكسب</span>
        </Link>
        <MobileBottomLink to="/assistant" icon={<Sparkles className="w-5 h-5" />} label="المساعد" />
        <MobileBottomLink
          to={state.user ? '/profile' : '/auth'}
          icon={<User className="w-5 h-5" />}
          label="حسابي"
        />
      </nav>

      {/* Floating Toasts */}
      <div
        aria-live="polite"
        className="fixed bottom-20 lg:bottom-5 left-5 z-50 flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-sm font-bold bg-card ${
              t.type === 'success'
                ? 'border-success/30 text-success'
                : t.type === 'error'
                ? 'border-destructive/30 text-destructive'
                : 'border-border text-foreground'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarSubLink({
  to,
  icon,
  label,
  accent,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  accent?: boolean;
}) {
  const location = useLocation();
  const fullCurrent = location.pathname + location.search;
  const isActive = to.includes('?') ? fullCurrent === to : location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] transition-colors ${
        isActive
          ? 'bg-secondary text-primary font-bold'
          : accent
          ? 'text-primary font-bold hover:bg-muted'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground font-medium'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {isActive && <ChevronLeft className="w-3.5 h-3.5 shrink-0" />}
    </Link>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="hover:text-foreground transition-colors flex items-center gap-1.5">
      <span className="text-border">•</span>
      <span>{label}</span>
    </Link>
  );
}

function MobileBottomLink({
  to,
  icon,
  label,
  end,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] font-medium ${
          isActive ? 'text-primary font-bold' : 'text-muted-foreground'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
