import axios from 'axios'
require('dotenv').config();
const { chromium } = require('playwright');
import { test, expect } from '@playwright/test';

test('エポスカード', async () => {
  const { data } = await axios.get('http://127.0.0.1:9222/json/version')
  const wsEndpoint = data.webSocketDebuggerUrl
  const browser = await chromium.connectOverCDP(wsEndpoint);
  const defaultContext = browser.contexts()[0];
  const page = defaultContext.pages()[0];

  await page.goto('https://www.eposcard.co.jp/memberservice/pc/login/login_preload.do');

  // 未ログインの場合のみログイン処理を行う
  const isLoginFormVisible = await page.isVisible('input[name="loginId"]')

  if(isLoginFormVisible) {
    await page.locator('input[name="loginId"]').click();
    await page.locator('input[name="loginId"]').fill(process.env.EPOS_CARD_ID);
    await page.locator('input[name="loginId"]').press('Tab');
    await page.locator('input[name="passWord"]').fill(process.env.EPOS_CARD_PASS);
    await page.locator('input[value="ログイン"]').click();
  }

  await page.locator('div#naviBlock div.sideNaviCardInfoBox p').getByRole('link', { name: 'ご利用可能額を見る' }).click();

  // 残高参照
  const amount = await page.locator('tr.remaining-row td.detailCell01.alR').nth(0).innerText()
  console.log(`エポスカード: ${amount}`)
});
