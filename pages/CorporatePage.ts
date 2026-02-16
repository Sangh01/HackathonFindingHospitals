import { Page, Locator } from "@playwright/test";
import { CorporatePageLocators } from "../locators/CorporatePageLocators";
import { takeActionScreenshot } from "../utils/HelperFunctions";

export class CorporatePage {

  constructor(private page: Page) {}

  async fillForm(data: any) {
    await this.page.locator(CorporatePageLocators.nameTextbox).fill(data.name);
    await this.page.locator(CorporatePageLocators.organizationNameTextbox).fill(data.company);
    await this.page.locator(CorporatePageLocators.officialEmailTextbox).fill(data.email);
    await this.page.locator(CorporatePageLocators.contactNumberTextbox).fill(data.phone);

    await this.page.locator(CorporatePageLocators.organizationSizeSelect).selectOption('1001-5000');
    await this.page.locator(CorporatePageLocators.interestedInSelect).selectOption('Taking a demo');
    await takeActionScreenshot(this.page, 'form-filled');
    
  }

  async submit() {
    await this.submitControl().click();
    await takeActionScreenshot(this.page, 'form-submitted');  
  }

  // Targets the interactive submit control (button/input/anchor) — not the H2 title.
  private submitControl(): Locator {
    const byRoleBtn    = this.page.locator(CorporatePageLocators.submitByRoleButton).first();
    const btnInHeader  = this.page.locator(CorporatePageLocators.submitButtonInHeader).first();
    const inputSubmit  = this.page.locator(CorporatePageLocators.submitInput).first();
    const anchorButton = this.page.locator(CorporatePageLocators.submitAnchor).first();
    return byRoleBtn.or(btnInHeader).or(inputSubmit).or(anchorButton);
  }

  async isSubmitButtonEnabled(): Promise<boolean> {
    const btn = this.submitControl();
    await btn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const enabledByAPI = await btn.isEnabled().catch(() => false);
    if (!enabledByAPI) return false;

    const ariaDisabled = await btn.getAttribute('aria-disabled');
    if (ariaDisabled === 'true') return false;

    const disabledAttr = await btn.getAttribute('disabled');
    if (disabledAttr !== null) return false;

    return true;
  }
}