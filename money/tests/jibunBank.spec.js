import { test, expect } from '@playwright/test';

test('じぶん銀行の残高参照', async ({ page }) => {
  await page.goto('https://www.jibunbank.co.jp/');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('list').filter({ hasText: '口座開設 ログイン' }).getByRole('link', { name: 'ログイン' }).click();
  const page1 = await page1Promise;
  await page1.locator('#customerNo1').click();
  await page1.locator('#customerNo1').fill('');
  await page1.locator('#customerNo2').click();
  await page1.locator('#customerNo2').fill('');
  await page1.locator('#loginPW').click();
  await page1.locator('#loginPW').fill('');
  await page1.getByRole('link', { name: 'ログイン', exact: true }).click();

  // 残高参照
  const amount = await page1.getByRole('listitem').filter({ hasText: '預かり資産残高' }).locator('p').innerText();
  console.log(`じぶん銀行残高: ${amount}`)
});
