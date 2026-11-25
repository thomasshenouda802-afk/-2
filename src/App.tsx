import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import {
  RanksPage,
  ContestsPage,
  ContestDetailPage,
  RecordsPage,
  GuidePage,
  UpdatesPage,
  PartnerPage,
  DeleteAccountPage,
  ArabicTermsPage,
  ArabicPrivacyPage,
  EnglishTermsPage,
  EnglishPrivacyPage,
} from './pages/PublicPages';
import {
  EarnTasksPage,
  PartnerOffersPage,
  StartPlanPage,
  AccountsPage,
} from './pages/EarnPages';
import {
  WalletPage,
  WithdrawPage,
  ExchangePage,
  ResellerPage,
  ResellerChatPage,
  ReferralsPage,
  AuctionsPage,
} from './pages/FinancePages';
import {
  NewCampaignPage,
  MyCampaignsPage,
  AssistantPage,
  SupportPage,
  ProfilePage,
} from './pages/CampaignAndSupportPages';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* الشغل والربح */}
            <Route path="/earn" element={<EarnTasksPage platform="all" />} />
            <Route path="/earn/all" element={<EarnTasksPage platform="tiktok" />} />
            <Route path="/youtube" element={<EarnTasksPage platform="youtube" />} />
            <Route path="/instagram" element={<EarnTasksPage platform="instagram" />} />
            <Route path="/twitter" element={<EarnTasksPage platform="twitter" />} />
            <Route path="/partner-offers" element={<PartnerOffersPage />} />
            <Route path="/start" element={<StartPlanPage />} />
            <Route path="/accounts" element={<AccountsPage />} />

            {/* فلوسي */}
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
            <Route path="/exchange" element={<ExchangePage />} />
            <Route path="/reseller" element={<ResellerPage />} />
            <Route path="/reseller/chat" element={<ResellerChatPage />} />

            {/* الدعوات والمزاد */}
            <Route path="/referrals" element={<ReferralsPage />} />
            <Route path="/auctions" element={<AuctionsPage />} />

            {/* للمعلنين */}
            <Route path="/campaigns/new" element={<NewCampaignPage />} />
            <Route path="/campaigns" element={<MyCampaignsPage />} />

            {/* الإنجازات */}
            <Route path="/ranks" element={<RanksPage />} />
            <Route path="/contests" element={<ContestsPage />} />
            <Route path="/contests/:id" element={<ContestDetailPage />} />
            <Route path="/records" element={<RecordsPage />} />

            {/* المساعدة والمحتوى العام */}
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/updates" element={<UpdatesPage />} />
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/delete-account" element={<DeleteAccountPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* القانونية */}
            <Route path="/terms" element={<ArabicTermsPage />} />
            <Route path="/privacy" element={<ArabicPrivacyPage />} />
            <Route path="/en/terms" element={<EnglishTermsPage />} />
            <Route path="/en/privacy" element={<EnglishPrivacyPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppProvider>
  );
}
