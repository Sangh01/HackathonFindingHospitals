import { Page } from '@playwright/test';
import { HomeLocators } from '../locators/HomeLocators';
import { takeActionScreenshot } from '../utils/HelperFunctions';

export class HomePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://www.practo.com/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async searchLocation(location: string): Promise<void> {
    await this.page.locator(HomeLocators.searchLocation).fill('');
    await this.page.locator(HomeLocators.searchLocation).pressSequentially(location, { delay: 150 });
    await this.page.locator(HomeLocators.suggestionMain).first().click();
    await takeActionScreenshot(this.page, `location-selected-${location}`);
    
  }

  async searchService(service: string): Promise<void> {
    await this.page.locator(HomeLocators.searchService).fill(service);
    await this.page.getByText(service).nth(3).click();
    await takeActionScreenshot(this.page, `service-selected-${service}`);
  }

  async open() {
    await this.page.goto("/");
  }

  async openCorporatePage() {
    // Click "For Corporates" from navbar dropdown
    await this.page.getByText('For Corporates').first().click();
    
    // Click "Health & Wellness Plans"
    await this.page.getByRole('link', { name: 'Health & Wellness Plans' }).click();
    await takeActionScreenshot(this.page, 'health-wellness-plans-clicked');
  }




}
