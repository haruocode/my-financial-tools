require('dotenv').config();
import { test, expect } from '@playwright/test';

test('エポスカード', async ({ page }) => {
  await page.goto('https://www.eposcard.co.jp/memberservice/pc/login/login_preload.do');
  await page.locator('input[name="loginId"]').click();
  await page.locator('input[name="loginId"]').fill(process.env.EPOS_CARD_ID);
  await page.locator('input[name="loginId"]').press('Tab');
  await page.locator('input[name="passWord"]').fill(process.env.EPOS_CARD_PASS);
  await page.getByRole('link', { name: 'ログイン', exact: true }).click();

  // パズル認証があるので認証完了まで待つ
  await page.waitForURL('**/web_service_top_preload.do');

  await page.locator('div#naviBlock div.sideNaviCardInfoBox p').getByRole('link', { name: 'ご利用可能額を見る' }).click();

  // 残高参照
  const amount = await page.locator('tr.remaining-row td.detailCell01.alR').nth(0).innerText()
  console.log(`エポスカード: ${amount}`)
});
