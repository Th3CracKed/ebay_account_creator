import * as puppeteer from 'puppeteer';
import { getElement } from './helper';
import fetch from 'node-fetch';

(async () => {
  const namesResponse = await (await fetch('https://namey.muffinlabs.com/name.json?count=1&with_surname=true&frequency=common')).json();
  const [firstName, lastName] = namesResponse[0].split(' ');
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto('https://www.ebay.co.uk/', { waitUntil: 'networkidle0' });
  const registerButton = await getElement(page, 'register', 'a', 'header');
  await registerButton.click({ delay: 200 });
  await page.waitForSelector('#firstname', { visible: true });
  await page.waitForFunction(() => document.readyState === 'complete');
  await page.type('#firstname', firstName, { delay: 200 });
  await page.type('#lastname', lastName, { delay: 200 });
  await page.type('#Email', `${firstName}${lastName}@outlook.com`, { delay: 200 });
  await page.type('#password', 'FZFZUHZFUZ273', { delay: 200 });
  await page.waitForFunction(() => {
    return document.querySelectorAll('button#EMAIL_REG_FORM_SUBMIT:not([disabled])').length > 0
  });
  await page.click('button#EMAIL_REG_FORM_SUBMIT', { delay: 200 });
  console.log('done');

})();
