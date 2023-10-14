import test, { expect } from "@playwright/test";

test.describe("Check sign in page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/sign-in");
  });

  test("has sign in title", async ({ page }) => {
    await expect(page).toHaveTitle(/gametrakr/);
  });

  test("has sign in header", async ({ page }) => {
    await page.isVisible("text='Welcome back'");
  });

  test("link to sign up page", async ({ page }) => {
    const createAccount = page.locator("text=Create an Account");
    await expect(createAccount).toHaveAttribute("href", "/auth/sign-up");
  });

  test("link to forgot password page", async ({ page }) => {
    const forgotPassword = page.locator("text=Forgot your password?");

    await expect(forgotPassword).toHaveAttribute(
      "href",
      "/auth/forgot-password",
    );

    await forgotPassword.click();

    await expect(page).toHaveTitle(/gametrakr/);
    await expect(page).toHaveURL(/\/auth\/forgot-password/);
  });

  // TODO: add error on invalid login test
});
