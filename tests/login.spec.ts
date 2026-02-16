import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

interface LoginCase { 
    testCase: string; 
    username: string; 
    password: string;
    Locator: string; 
    expectedResult: string; 
}

let loginCases: LoginCase[] = JSON.parse(fs.readFileSync('data_Files/LoginCases.json', 'utf8'));

loginCases = loginCases.map((ts: LoginCase): LoginCase => {
  return {
    ...ts,
    username: ts.username === "env.LOGIN_USERNAME"
      ? process.env.LOGIN_USERNAME || ""
      : ts.username,
    password: ts.password === "env.LOGIN_PASSWORD"
      ? process.env.LOGIN_PASSWORD || ""
      : ts.password
  };
});


test.describe('@loginTests', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('https://www.practo.com/');
        await page.getByText('Login / Signup').click();
    });

    test.afterEach(async ({page}) => {
        await page.context().clearCookies();
    });

    loginCases.forEach(({testCase, username, password, Locator, expectedResult}) => {
        test(testCase, async ({page}) => {
            const loginPage = new LoginPage(page);
            await loginPage.login(username, password);
            await expect(page.locator(Locator).getByText(expectedResult).last()).toBeVisible();
            await page.waitForLoadState('networkidle');
            await page.screenshot({path: `screenshots/${testCase}.png`, fullPage: true});
        });
    });
});