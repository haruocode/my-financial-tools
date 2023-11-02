import axios from 'axios'
const { chromium } = require('playwright');
import { test, expect } from '@playwright/test';

test('PayPayカード', async () => {
  const { data } = await axios.get('http://127.0.0.1:9222/json/version')
  const wsEndpoint = data.webSocketDebuggerUrl
  const browser = await chromium.connectOverCDP(wsEndpoint);
  const defaultContext = browser.contexts()[0];
  const page = defaultContext.pages()[0];

  await page.goto('https://www.paypay-card.co.jp/member/setting/display-balance', { waitUntil: 'networkidle' });

  // 残高参照
  const selector = 'table > tr > td > p'
  const amount = await page.locator(selector).nth(1).innerText()
  console.log(`PayPayカード: ${amount}`)
});
