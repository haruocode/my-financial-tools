require('dotenv').config();
import { test, expect } from '@playwright/test';

test('みずほ銀行の残高参照', async ({ page }) => {
  await page.goto('https://web.ib.mizuhobank.co.jp/servlet/LOGBNK0000000B.do');
  await page.locator('#txbCustNo').click();
  await page.locator('#txbCustNo').fill(process.env.MIZUHO_BANK_NO);
  await page.getByRole('button', { name: '次 へ' }).click();
  await page.locator('#PASSWD_LoginPwdInput').click();
  await page.locator('#PASSWD_LoginPwdInput').fill(process.env.MIZUHO_BANK_PASS);
  await page.getByRole('button', { name: 'ログイン' }).click();
  await page.getByRole('link', { name: '＞ 次へ' }).click();

  // 残高参照
  const amount = await page.locator('table.n02000-t3 tr').nth(4).locator('td').innerText()
  console.log(`みずほ銀行: ${amount}`)
});
