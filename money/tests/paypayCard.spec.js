// const { execSync } = require('child_process')
// const { chromium } = require('playwright');
// import { test, expect } from '@playwright/test';

// const stdout = execSync('/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222 &')
// console.log(`stdout: ${stdout.toString()}`)

// test('PayPayカード', async () => {
//   const wsEndpoint = 'ws://127.0.0.1:9222/devtools/browser/c5d552cd-d59a-4019-8f51-b0503e23d47b'
//   const browser = await chromium.connectOverCDP(wsEndpoint);
//   const defaultContext = browser.contexts()[0];
//   const page = defaultContext.pages()[0];

//   await page.goto('https://www.paypay-card.co.jp/member/setting/display-balance', { waitUntil: 'networkidle' });

//   // 残高参照
//   const selector = '.src-components-atoms-TableItem-TableItem__value-33kw > p'
//   const amount = await page.locator(selector).nth(1).innerText()
//   console.log(`PayPayカード: ${amount}`)
// });
