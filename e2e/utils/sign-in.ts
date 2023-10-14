import type { Page } from "@playwright/test";

type SignInProps = {
  page: Page;
  email: string;
  password: string;
  url?: string;
};
export const signIn = async ({ page, url, email, password }: SignInProps) => {
  await page.goto(url ?? "/auth/sign-in");
  await page.locator('input[name="credential"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => url.origin === "http://localhost:3000", {
    waitUntil: "networkidle",
  });
};
