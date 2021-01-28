import { Page } from 'puppeteer';
import { findAsync } from './utils';

export async function getElement(page: Page, textToSearchFor: string, selector: string, containerSelector = 'body') {
    const container = await page.$(containerSelector);
    const links = await container.$$(selector);
    const registerButton = await findAsync(links, async (link) => {
        const textContent = (await (await link.getProperty('textContent')).jsonValue());
        return typeof textContent === 'string' ? textContent.toLowerCase() === textToSearchFor : false;
    });
    return registerButton;
}

export async function checkIfTextExistsInAPage(page: Page, textToCheck: string) {
    const html = await page.evaluate(() => document.body.innerHTML);
    return html ? html.indexOf(textToCheck) !== -1 : true;
}

export async function waitForNavigation(page: Page, selector: string) {
  await page.waitForSelector(selector, { visible: true });
  await page.waitForFunction(() => document.readyState === 'complete');
}