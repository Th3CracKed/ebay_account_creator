import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { waitForNavigation, getElement, checkIfTextExistsInAPage } from './helper';
import fetch from 'node-fetch';
import { generateRandomPassword } from './utils';
import { Page } from 'puppeteer';

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
      const email = `${firstName}${lastName}@outlook.com`; // TODO API
      const confirmationEmail = await fillMail(page, email);
      await page.type('#rbusinessemail', confirmationEmail, { delay: 200 });
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
      await page.waitForTimeout(3000);// TODO try better implementation => wait for ajax request 
      const userNameAlreadyExists = await page.$$('.ansug');
      if (userNameAlreadyExists.length > 0) {
        await page.click('.ansug');
      }
      await page.waitForFunction(() => {
        return document.querySelectorAll('#btn_cyuipt:not([disabled])').length > 0
      });
      const element = await page.$("#cyuipt");
      const userName = await page.evaluate(element => element.value, element);
      await page.click('#btn_cyuipt', { delay: 200 });
      await waitForNavigation(page, '#addressSugg');
      const address = '100A Hertingfordbury Road'; // TODO from api


      // const address2 = 'Pentlow'; // TODO from api
      // const zip = 'CO10 7JT';
      // const city = 'Sudbury';
      // const state = 'Essex';
      await page.click('#dontHaveVatId', { delay: 200 });
      await page.type('#addressSugg', address, { delay: 200 });
      // await page.click('#addressSugg_manualEntryCntr', { delay: 200 });
      await page.click('#addressSugg_suggList', { delay: 200 });
      await page.waitForTimeout(2000);// TODO try better implementation => wait for ajax request 
      // await page.click('#addressSugg_listitem0', { delay: 200 });
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
      const pin = '424232'; // TODO pin
      await page.type('#phonePin', pin);
      await page.waitForFunction(() => {
        return document.querySelectorAll('#ContinueButton:not([disabled])').length > 0
      });
      // ResendPINButton
      await page.click('#ContinueButton', { delay: 200 });
      console.log('done');
      console.log(confirmationEmail, password, firstName, lastName, userName);
    } catch (err) {
      console.error('Something Wrong happened while creating an account');
      console.error(err);
    }
  })

async function fillMail(page: Page, email: string): Promise<string> {
  await page.type('#businessemail', email, { delay: 200 });
  await page.focus('#rbusinessemail');
  await page.waitForTimeout(3000);// TODO try better implementation => wait for ajax request 
  try {
    const alreadyExist = await checkIfTextExistsInAPage(page, 'Your email address is already registered with eBay.');
    if (alreadyExist) {
      const newEmail = getNewEmail();
      await clearInput(page, '#businessemail');
      return fillMail(page, newEmail); // TODO api
    } else {
      return email;
    }
  } catch (err) {
    return email;
  }

}
async function clearInput(page: Page, selector: string) {
  await page.focus('#businessemail');
  const inputValue = await page.$eval(selector, (el: any) => el.value);
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace');
  }
}

function getNewEmail() {
  const randomNum = getRandomArbitrary(1000, 9999999)
  return `AmailThatDoesntExists${randomNum}@outlook.com`
}


/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

