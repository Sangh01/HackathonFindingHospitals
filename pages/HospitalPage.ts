import { Page, Locator } from '@playwright/test';
import { HospitalLocators } from '../locators/HospitalLocators';

export class HospitalPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getHospitalNames(): Promise<Locator[]> {
    await this.page.waitForSelector(HospitalLocators.hospitalName);
    return await this.page.locator(HospitalLocators.hospitalName).all();
  }

  async evaluateHospital(newPage: Page, name: string): Promise<boolean> {
    await newPage.waitForLoadState('domcontentloaded');
    
    // const ratingText = await newPage.locator(HospitalLocators.ratingValue).textContent();
    
  const ratingLocator = newPage.locator(HospitalLocators.ratingValue).first();
  let ratingText = '0';
  if (await ratingLocator.isVisible()) {
  ratingText = (await ratingLocator.textContent())?.trim() || '0';
  }

    const isAvailable = await newPage.getByText('Open 24 x 7').isVisible();
    

    console.log(`Rating for ${name}: ${ratingText}, Open 24x7: ${isAvailable}`);  
    
    const isButton = await newPage.getByText('Read more info').isVisible();
    console.log(`Read more info button for ${name} is visible: ${isButton}`);

    if (!isButton) return false;

    await newPage.getByText('Read more info').click();
    await newPage.waitForTimeout(5000);
    const isParking = await newPage.getByText('Parking', { exact: true }).isVisible();
    const rating = parseFloat(ratingText || '0');

    return rating > 3.5 && isAvailable && isParking;
  }
}
