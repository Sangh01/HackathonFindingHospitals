import {Page,Locator,expect} from '@playwright/test';
import { LabTestLocator } from '../locators/LabTestLocator';
import { takeActionScreenshot } from '../utils/HelperFunctions';


export class LabTestsPage{

   page:Page;


    constructor(page: Page){
    this.page=page;

   }
   
   async navigate(){
      await this.page.goto("https://www.practo.com/");
   }

   async lab(){
      await this.page.locator(LabTestLocator.lab1).first().click();
      await this.page.waitForLoadState('networkidle');
    
   }
   
   
   private escapeRegExp(s: string) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   }

  
  async selectCity(city: string) {
    const input = this.page.locator(LabTestLocator.cityInput).or(this.page.locator(LabTestLocator.cityInputAlt));
    await input.click();
    await input.fill(''); // clear
    await input.pressSequentially(city, { delay: 50 }); 
    await takeActionScreenshot(this.page, `select-city-${city}`);

    const exactOption = this.page.locator(LabTestLocator.suggestionItems).filter({
      hasText: new RegExp(`^${this.escapeRegExp(city)}$`, 'i'),
    });

    await exactOption.first().click(); 
    await takeActionScreenshot(this.page, `city-selected-${city}`);
   }
   
   async getCityList() {
    try {
      //await this.page.getByRole('textbox', { name: LabTestLocator.globalSearchInput }).click();
      const cities = await this.page.locator('.city-selector__city').all();
     
      const cityNames = await Promise.all(cities.map(city => city.innerText()));
      console.log('Available cities:', cityNames);
      return cityNames;
    } catch (error) {
      console.error('Error retrieving city list:', error);

    }
  }

   

   async searchAndSelectTest(testName: string) {
    //await this.page.getByRole('textbox', { name: LabTestLocator.globalSearchInput }).click();
    await this.page.getByRole('textbox', { name: LabTestLocator.globalSearchInput }).pressSequentially(testName, { delay: 200 });
    const row = this.page.locator('.c-suggestion').filter({
      has: this.page.getByText('Complete Blood Count', { exact: true }),
      });

    await row.first().click();
   }

   async addToCart() {
    await this.page.locator(LabTestLocator.addToCartButton).click();
   }

   async expectItemInCart(itemName: string) {
    await expect(this.page.locator(LabTestLocator.cartItemTitles)).toContainText(itemName, { timeout: 5000 });
   }

   getCartItemTitles() {
    return this.page.locator(LabTestLocator.cartItemTitles);
   }

}