
import { test, expect } from '@playwright/test';
import { LabTestsPage } from '../pages/LabTestsPage';
import { takeActionScreenshot } from '../utils/HelperFunctions';

test("@regression lab tests",async({page})=>{
  
    const labTests=new LabTestsPage(page);
    await labTests.navigate();
    await takeActionScreenshot(page, 'navigate');
   // await page.pause();
    await labTests.lab();
    
    
    const cities = await labTests.getCityList();

    const popularCities = ['Mumbai', 'Delhi', 'Chennai'];
    popularCities.forEach(city => expect(cities).toContain(city));
    
    await labTests.selectCity('Pune');
    await labTests.searchAndSelectTest('Complete Blo');
    await labTests.addToCart();
    await takeActionScreenshot(page, 'add-to-cart');

    await labTests.expectItemInCart('Complete Blood Count');
    await takeActionScreenshot(page, 'expect-item-in-cart');

})