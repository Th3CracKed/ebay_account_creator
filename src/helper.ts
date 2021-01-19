import { Page } from 'puppeteer';
import { findAsync } from './utils';

export async function getElement(page: Page, textToSearchFor: string, selector: string, containerSelector = 'body') {
    const container = await page.$(containerSelector);
    const links = await container.$$(selector);
    const registerButton = await findAsync(links, async (link) => {
        const textContent = (await (await link.getProperty('textContent')).jsonValue());
        return textContent === textToSearchFor;
    });
    return registerButton;
}