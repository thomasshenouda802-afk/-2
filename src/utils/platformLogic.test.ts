import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMemberRank,
  calculateNetReward,
  calculateCampaignCost,
  calculateCampaignRefund,
  calculatePartnerProfit,
  validatePassword,
  filterFaqs,
  searchSiteDirectory,
} from './platformLogic';

test('calculateMemberRank follows Tafa3al tier rules accurately', () => {
  assert.equal(calculateMemberRank(50, 0).id, 'bronze');
  assert.equal(calculateMemberRank(50, 0).feePercent, 5);

  // Silver requires 200 points AND 2 clean withdrawals
  assert.equal(calculateMemberRank(250, 1).id, 'bronze');
  assert.equal(calculateMemberRank(200, 2).id, 'silver');
  assert.equal(calculateMemberRank(200, 2).feePercent, 4);

  // Gold requires 600 points AND 4 clean withdrawals
  assert.equal(calculateMemberRank(700, 3).id, 'silver');
  assert.equal(calculateMemberRank(600, 4).id, 'gold');
  assert.equal(calculateMemberRank(600, 4).feePercent, 3);

  // Diamond requires 1500 points
  assert.equal(calculateMemberRank(1500, 0).id, 'diamond');
  assert.equal(calculateMemberRank(1500, 0).feePercent, 2);
});

test('calculateNetReward deducts rank fee accurately', () => {
  assert.equal(calculateNetReward(0.02, 5), 0.019);
  assert.equal(calculateNetReward(0.02, 2), 0.0196);
  assert.equal(calculateNetReward(-5, 5), 0);
});

test('calculateCampaignCost computes subtotal, guarantee, and total', () => {
  const noGuarantee = calculateCampaignCost({
    service: 'follow',
    quantity: 100,
    withGuarantee: false,
  });
  assert.equal(noGuarantee.subtotal, 1.5);
  assert.equal(noGuarantee.guaranteeCost, 0);
  assert.equal(noGuarantee.total, 1.5);

  const withGuarantee = calculateCampaignCost({
    service: 'follow',
    quantity: 100,
    withGuarantee: true,
  });
  assert.equal(withGuarantee.subtotal, 1.5);
  assert.equal(withGuarantee.guaranteeCost, 0.3);
  assert.equal(withGuarantee.total, 1.8);

  // Like does not support guarantee
  const likeWithGuarantee = calculateCampaignCost({
    service: 'like',
    quantity: 100,
    withGuarantee: true,
  });
  assert.equal(likeWithGuarantee.guaranteeCost, 0);
  assert.equal(likeWithGuarantee.total, 0.9);
});

test('calculateCampaignRefund returns exact unspent portion', () => {
  assert.equal(calculateCampaignRefund({ totalBudget: 10, completedCount: 25, targetQuantity: 100 }), 7.5);
  assert.equal(calculateCampaignRefund({ totalBudget: 10, completedCount: 100, targetQuantity: 100 }), 0);
  assert.equal(calculateCampaignRefund({ totalBudget: 10, completedCount: 0, targetQuantity: 100 }), 10);
});

test('calculatePartnerProfit matches Tafa3al partner calculator defaults', () => {
  const result = calculatePartnerProfit({
    monthlyVolume: 2000,
    marginPercent: 5,
    monthlyOrders: 20,
  });
  assert.equal(result.monthlyProfit, 100);
  assert.equal(result.avgPerOrder, 5);
  assert.equal(result.annualEstimate, 1200);
});

test('validatePassword enforces all 4 signup criteria', () => {
  assert.equal(validatePassword('short1!').isValid, false);
  assert.equal(validatePassword('12345678!').hasEnglishLetter, false);
  assert.equal(validatePassword('abcdefgh!').hasDigit, false);
  assert.equal(validatePassword('abcdefg1').hasSymbol, false);
  assert.equal(validatePassword('Tafa3al!2026').isValid, true);
});

test('filterFaqs filters by category and search term', () => {
  const faqs = [
    { id: '1', category: 'account' as const, question: 'هل بتطلبوا كلمة مرور؟', answer: 'أبدًا.' },
    { id: '2', category: 'earnings' as const, question: 'إمتى أقدر أسحب أرباحي؟', answer: 'فورًا بعد التأكيد.' },
  ];
  assert.equal(filterFaqs(faqs, 'account', '').length, 1);
  assert.equal(filterFaqs(faqs, 'all', 'أسحب').length, 1);
  assert.equal(filterFaqs(faqs, 'campaigns', '').length, 0);
});

test('searchSiteDirectory matches Arabic and English queries', () => {
  const entries = [
    { title: 'المحفظة', subtitle: 'رصيدك ومعاملاتك', path: '/wallet', keywords: 'wallet رصيد' },
    { title: 'اكسب المال', subtitle: 'مهام تيك توك ويوتيوب', path: '/earn', keywords: 'earn tasks' },
  ];
  assert.equal(searchSiteDirectory(entries, 'محفظة').length, 1);
  assert.equal(searchSiteDirectory(entries, 'earn').length, 1);
});
