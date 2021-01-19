import * as puppeteer from 'puppeteer';

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
  await page.type('#Email', 'pff2z221az@outlook.com', { delay: 200 });
  await page.type('#password', 'FZFZUHZFUZ273', { delay: 200 });
  await page.waitForFunction(() => {
    return document.querySelectorAll('button#EMAIL_REG_FORM_SUBMIT:not([disabled])').length > 0
  });
  await page.click('button#EMAIL_REG_FORM_SUBMIT', { delay: 200 });
  console.log('done');

})();


async function getElement(page: puppeteer.Page, textToSearchFor: string, selector: string, containerSelector = 'body') {
  const container = await page.$(containerSelector);
  const links = await container.$$(selector);
  const registerButton = await findAsync(links, async (link) => {
    const textContent = (await (await link.getProperty('textContent')).jsonValue());
    return textContent === textToSearchFor;
  });
  return registerButton;
}

async function findAsync<T>(array: T[], predicate: (value: T, index?: number, obj?: T[]) => Promise<boolean>): Promise<T> {
  const candidates = await Promise.all(array.map(predicate));
  const index = candidates.findIndex(candidate => candidate);
  return array[index];
}
