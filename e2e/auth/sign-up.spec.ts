import { expect, test } from "@playwright/test";

test.describe("Check sign up page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/sign-up");
  });

  test("has sign up title", async ({ page }) => {
    await expect(page).toHaveTitle(/gametrakr/);
  });

  test("has sign up header", async ({ page }) => {
    await page.isVisible("text='Join the community'");
  });

  test("link to sign in page", async ({ page }) => {
    const createAccount = page.locator("text=Sign in");
    await expect(createAccount).toHaveAttribute("href", "/auth/sign-in");
  });

  test.describe("Nickname validators", () => {
    test("error with too short nickname", async ({ page }) => {
      await page.locator('input[name="username"]').fill("cb");

      await page.locator('button[type="submit"]').click();

      await expect(
        page.getByText("Nickname must be at least 3 characters"),
      ).toBeVisible();
    });

    test("error with too long nickname", async ({ page }) => {
      await page
        .locator('input[name="username"]')
        .fill("crash.bandicoot.n.sane.trilogy");

      await page.locator('button[type="submit"]').click();

      await expect(
        page.getByText("Nickname must be not exceed 24 characters"),
      ).toBeVisible();
    });

    test("error with invalid characters", async ({ page }) => {
      await page.locator('input[name="username"]').fill("crash bandicoot");

      await page.locator('button[type="submit"]').click();

      await expect(
        page.getByText(
          "Nickname can only have alphanumeric characters, underscores, and dots",
        ),
      ).toBeVisible();
    });
  });

  test.describe("Email validators", () => {
    test("error with invalid email", async ({ page }) => {
      await page.locator('input[name="username"]').fill("crash.bandicoot");
      await page.locator('input[name="email"]').fill("crash.bandicoot");

      await page.locator('button[type="submit"]').click();

      await expect(page.getByText("Invalid email")).toBeVisible();
    });
  });

  test.describe("Password validators", () => {
    test("error with too short password", async ({ page }) => {
      await page.locator('input[name="username"]').fill("crash.bandicoot");
      await page.locator('input[name="email"]').fill("crash@bandicoot.com");
      await page.locator('input[name="password"]').fill("short");

      await page.locator('button[type="submit"]').click();

      await expect(
        page.getByText("Password must be at least 8 characters"),
      ).toBeVisible();
    });

    test("error with invalid regex", async ({ page }) => {
      await page.locator('input[name="username"]').fill("crash.bandicoot");
      await page.locator('input[name="email"]').fill("crash@bandicoot.com");
      await page.locator('input[name="password"]').fill("abcdefgh");

      await page.locator('button[type="submit"]').click();

      await expect(
        page.getByText(
          "Password should include uppercase and lowercase letters, numbers, and special characters",
        ),
      ).toBeVisible();
    });
  });

  test.describe("Confirm password validators", () => {
    test("error passwords not matching", async ({ page }) => {
      await page.locator('input[name="username"]').fill("crash.bandicoot");
      await page.locator('input[name="email"]').fill("crash@bandicoot.com");
      await page.locator('input[name="password"]').fill("ABcd123!");
      await page.locator('input[name="confirmPassword"]').fill("Abcd123!");

      await page.locator('button[type="submit"]').click();

      await expect(page.getByText("Passwords don't match")).toBeVisible();
    });
  });
});
