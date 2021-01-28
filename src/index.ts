import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { waitForNavigation, getElement } from './helper';
import fetch from 'node-fetch';
import { generateRandomPassword } from './utils';

puppeteer
  .use(StealthPlugin())
  .launch({ headless: false })
  .then(async browser => {
    try {
      const namesResponse = await (await fetch('https://namey.muffinlabs.com/name.json?count=1&with_surname=true&frequency=common')).json();
      if (!namesResponse || !namesResponse.length) {
        throw new Error('Unable to fetch name')
      }
      const [firstName, lastName] = namesResponse[0].split(' ');
      const phone = '2079460211';
      const page = await browser.newPage();
      await page.goto('https://www.ebay.co.uk/', { waitUntil: 'networkidle0' });

      const registerButton = await getElement(page, 'register', 'a', 'header');
      await registerButton.click({ delay: 200 });
      await waitForNavigation(page, '#firstname');
      const businessRegistrationLink = await getElement(page, 'create a business account', 'a');
      await businessRegistrationLink.click({ delay: 200 });
      // probable NEED TO Solve captcha here
      await waitForNavigation(page, '#businessname');
      await page.type('#businessname', firstName, { delay: 200 });
      const email = `${firstName}${lastName}@outlook.com`;

      /**
       * TODO
       * Your email address is already registered with eBay. Need help with your
       */
      await page.type('#businessemail', email, { delay: 200 });
      await page.type('#rbusinessemail', email, { delay: 200 });
      const password = generateRandomPassword();
      await page.type('#PASSWORD_BIZREG', password, { delay: 200 });
      await page.type('#phoneFlagComp1Business', phone, { delay: 200 });
      await page.waitForFunction(() => {
        return document.querySelectorAll('#sbtBtnBusiness:not([disabled])').length > 0
      });
      await page.click('#sbtBtnBusiness', { delay: 200 });
      // probable NEED TO SOlve captcha here
      await waitForNavigation(page, '#cyuipt');
      await page.type('#cyuipt', `${firstName}${lastName}`, { delay: 200 });
      await page.focus('#btn_cyuipt');
      await page.waitForTimeout(1000);
      const userNameAlreadyExists = await page.$$('.ansug');
      if (userNameAlreadyExists) {
        await page.click('.ansug');
      }
      await page.waitForFunction(() => {
        return document.querySelectorAll('#btn_cyuipt:not([disabled])').length > 0
      });
      await page.click('#btn_cyuipt', { delay: 200 });
      await waitForNavigation(page, '#addressSugg');
      const address = '85  Hertingfordbury Rd'; // TODO from api

      // #addressSugg_manualEntryCntr
      // const address2 = 'Pentlow'; // TODO from api
      // const zip = 'CO10 7JT';
      // const city = 'Sudbury';
      // const state = 'Essex';
      await page.click('#dontHaveVatId', { delay: 200 });
      await page.type('#addressSugg', address, { delay: 200 });
      await page.click('#addressSugg_suggList', { delay: 200 });
      // await page.type('#address2', address2, { delay: 200 });
      // await page.type('#zip', zip, { delay: 200 });
      // await page.type('#city', city, { delay: 200 });
      // await page.select('#state', state);
      // await page.type('vatId', vatId, { delay: 200 });
      await page.select('#salutation', '1') // 1 === 'Mr' 
      await page.type('#firstname', firstName);
      await page.type('#lastname', lastName);
      await page.select('#contactType', '1');
      await page.type('#contactPhone', phone);
      await page.click('#sbtBtn', { delay: 200 });
      await waitForNavigation(page, '#textButton');
      await page.click('#textButton', { delay: 200 });

      await waitForNavigation(page, '#phonePin');
      await page.click('#phonePin', { delay: 200 });
      await page.waitForFunction(() => {
        return document.querySelectorAll('#ContinueButton:not([disabled])').length > 0
      });
      const pin = '424232'; // TODO pin
      await page.type('#phonePin', pin);
      // ResendPINButton
      await page.click('#ContinueButton', { delay: 200 });
      console.log('done');
      console.log(email, password, firstName, lastName);
    } catch (err) {
      console.error('Something Wrong happened while creating an account');
      console.error(err);
    }
  })

