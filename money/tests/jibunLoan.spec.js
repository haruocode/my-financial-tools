import { test, expect } from '@playwright/test';

// TODO: そもそもテストにするのはおかしい・・
test('じぶん銀行カードローン', async ({ page }) => {
  await page.goto('https://www1.loan-alliance.com/LaWebp/pc/jibun/PKLI01.do');
  await page.locator('input[name="accountNumber"]').click();
  // TODO: 入力情報を環境変数にする
  await page.locator('input[name="accountNumber"]').fill('');
  // TODO: 入力情報を環境変数にする
  await page.locator('input[name="pinNumber"]').fill('');
  await page.getByRole('button', { name: 'ログイン' }).click();

  await page.getByRole('link', { name: '利用状況照会' }).click();

  // 利用総額
  // TODO: もっといい取得方法があるはず・・
  const targetElm = page.locator('tr').nth(13).locator('td').nth(1)
  console.log(await targetElm.innerText())
});
