require('dotenv').config();
import { test, expect } from '@playwright/test';

// TODO: そもそもテストにするのはおかしい・・
test('じぶん銀行カードローン', async ({ page }) => {
  await page.goto('https://www1.loan-alliance.com/LaWebp/pc/jibun/PKLI01.do');
  await page.locator('input[name="accountNumber"]').click();
  await page.locator('input[name="accountNumber"]').fill(process.env.JIBUN_LOAN_NO);
  await page.locator('input[name="pinNumber"]').fill(process.env.JIBUN_LOAN_PASS);
  await page.getByRole('button', { name: 'ログイン' }).click();

  await page.getByRole('link', { name: '利用状況照会' }).click();

  // 利用総額
  // TODO: もっといい取得方法があるはず・・
  const amount = await page.locator('tr').nth(13).locator('td').nth(1).innerText()
  console.log(`じぶん銀行カードローン: ${amount}`)
});
