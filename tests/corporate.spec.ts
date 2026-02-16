import { test, expect } from "@playwright/test";
import invalidData from "../data_Files/invalidData.json";
import { HomePage } from "../pages/HomePage";
import { CorporatePage } from "../pages/CorporatePage";
import { takeActionScreenshot } from "../utils/HelperFunctions";

test.describe("@corporate @buttonstate @negative", () => {
  test("Corporate Wellness - invalid data keeps the button disabled", async ({ page }) => {
    const home = new HomePage(page);
    //await page.pause();
    const corp = new CorporatePage(page);

    await home.navigate();
    await takeActionScreenshot(page, 'navigate');
    await home.openCorporatePage();

    // Fill INVALID data (from JSON)
    await corp.fillForm(invalidData);
    await takeActionScreenshot(page, 'filled-invalid-data');

    // Assert: With invalid data, submit button must be disabled
    const isEnabled = await corp.isSubmitButtonEnabled();
    await takeActionScreenshot(page, 'checked-button-state');
    expect(isEnabled).toBeFalsy();

    // Log for clarity (as requested)
    if (!isEnabled) {
      console.log("✅ Since the data is invalid, the 'Schedule a Demo' button is disabled.");
    }

    // Evidence screenshot
    await takeActionScreenshot(page, 'final-evidence');
  });
});