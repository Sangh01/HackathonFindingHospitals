import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { HospitalPage } from '../pages/HospitalPage';
import { takeActionScreenshot } from '../utils/HelperFunctions';  


test('@sanity Search hospitals and validate details', async ({ page, context }) => {
  // Basic hospital search functionality
  const homePage = new HomePage(page);
  const hospitalPage = new HospitalPage(page);

  await homePage.navigate();
  await takeActionScreenshot(page, 'navigate');
  await homePage.searchLocation('Bangalore');
  await homePage.searchService('Hospital');
  await takeActionScreenshot(page, 'search');

  const hospitalNames = await hospitalPage.getHospitalNames();
  console.log(`Total hospital found: ${hospitalNames.length}`);

  for (let hospital of hospitalNames) {
    const name = await hospital.textContent();
    if (!name) continue;
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      hospital.click(),
      await takeActionScreenshot(page, `click-${name}`),
      console.log(`Clicked on hospital: ${name}`)
    ]);

    const isValid = await hospitalPage.evaluateHospital(newPage, name);
    console.log(isValid ? `Name of hospital: ${name}` : 'it is not contain');
    await newPage.close();
  }
});
