import * as puppeteer from 'puppeteer';
import { getElement } from './helper';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto('https://www.ebay.co.uk/', { waitUntil: 'networkidle0' });
  const registerButton = await getElement(page, 'register', 'a', 'header');
  await registerButton.click({ delay: 200 });
  await page.waitForSelector('#firstname', { visible: true });
  await page.waitForFunction(() => document.readyState === 'complete');
  await page.type('#firstname', 'myName', { delay: 200 });
  await page.type('#lastname', 'myLastName', { delay: 200 });
  await page.type('#Email', 'pff2z2a21az@outlook.com', { delay: 200 });
  await page.type('#password', 'FZFZUHZFUZ273', { delay: 200 });
  await page.waitForFunction(() => {
    return document.querySelectorAll('button#EMAIL_REG_FORM_SUBMIT:not([disabled])').length > 0
  });
  await page.click('button#EMAIL_REG_FORM_SUBMIT', { delay: 200 });
  console.log('done');

})();
