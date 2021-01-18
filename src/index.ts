import * as puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto('https://www.ebay.co.uk/', { waitUntil: 'networkidle0' });
  await page.click('span#gh-ug-flex>a', { delay: 200 }); // TODO use more generic solution 
  await page.waitForSelector('#firstname', { visible: true }); // TODO check if interactive with waitForFunction?
  await page.waitFor(500); // Workaround because visible doesn't imply ready to receive actions :(
  await page.type('#firstname', 'myName', { delay: 200 });
  await page.type('#lastname', 'myLastName', { delay: 200 });
  await page.type('#Email', 'pffzadaz@outlook.com', { delay: 200 });
  await page.type('#password', 'FZFZUHZFUZ273', { delay: 200 });
  await page.waitForFunction(() => {
    return document.querySelectorAll('button#EMAIL_REG_FORM_SUBMIT:not([disabled])').length > 0
  });
  // console.log(await page.waitForFunction('button#EMAIL_REG_FORM_SUBMIT:not([disabled])'));
  await page.click('button#EMAIL_REG_FORM_SUBMIT', { delay: 200 });
  console.log('done');

})();
