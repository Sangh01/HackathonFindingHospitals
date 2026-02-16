import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  private page: Page;

  readonly loginForm: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loginForm = page.locator('#login_form');
    this.username = page.getByPlaceholder('Mobile Number / Email ID');
    this.password = page.getByPlaceholder('Password');
    this.loginButton = page.locator('#login');
  }

  async goToLoginPage() {
    await this.page.goto('https://accounts.practo.com/login');
  }

  async goToLoginPageFromHome() {
    await this.page.goto('https://www.practo.com/');
    await this.page.getByText('Login / Signup').click();
  }

  async login(username: string, password: string) {
    await expect(this.username).toBeVisible();
    await expect(this.username).toBeEnabled();
    await expect(this.password).toBeVisible();
    await expect(this.password).toBeEnabled();
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

}