require('dotenv').config();
import { test, expect } from '@playwright/test';

test('新生銀行', async ({ page }) => {
  await page.goto('https://bk.web.sbishinseibank.co.jp/SFC/apps/services/www/SFC/desktopbrowser/default/login?mode=1', { waitUntil: 'networkidle' });
  if(page.url() === 'https://bk.web.sbishinseibank.co.jp/maintenance/maintpage.html?mode=1') {
    console.log('メンテナンス中…')
    return
  }

  await page.locator('input[name="nationalId"]').click();
  await page.locator('input[name="nationalId"]').fill(process.env.SHINSEI_BANK_NO);
  await page.locator('#loginPassword').click();
  await page.locator('#loginPassword').fill(process.env.SHINSEI_BANK_PASS);
  await page.getByRole('button', { name: 'ログイン' }).click();

  // 画面表示時は一瞬0円なのでネットワーク状況も見る
  await page.waitForLoadState('networkidle');

  // 残高
  const amount = await page.locator('td.PTP0001_totalAmountTableTd span.ng-binding').innerText();
  console.log(`新生銀行: ${amount}`)
});
