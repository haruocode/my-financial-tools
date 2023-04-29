require('dotenv').config();
import { test, expect } from '@playwright/test';

test('新生銀行', async ({ page }) => {
  await page.goto('https://bk.web.sbishinseibank.co.jp/SFC/apps/services/www/SFC/desktopbrowser/default/login?mode=1');
  await page.locator('input[name="nationalId"]').click();
  await page.locator('input[name="nationalId"]').fill(process.env.SHINSEI_BANK_NO);
  await page.locator('#loginPassword').click();
  await page.locator('#loginPassword').fill(process.env.SHINSEI_BANK_PASS);
  await page.getByRole('button', { name: 'ログイン' }).click();

  await page.waitForTimeout(3000)

  // 残高
  const amount = await page.locator('td.PTP0001_totalAmountTableTd span.ng-binding')
    .innerText();
  console.log(`新生銀行: ${amount}`)
});
