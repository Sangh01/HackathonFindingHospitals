import { Page } from '@playwright/test';

const dateStr = new Date().toISOString().split('T')[0];
export const takeActionScreenshot = async (page: Page, name: string) => {
    await page.screenshot({ path: `screenshots/action-${name}-${dateStr}.png` });
};