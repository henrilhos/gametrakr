import { chromium } from "@playwright/test";
import { hash } from "argon2";

import { db } from "~/server/db";
import { signIn } from "./sign-in";

import type { FullConfig } from "@playwright/test";

const globalSetup = async (config: FullConfig) => {
  const email = "crash@bandicoot.com";
  const password = "g4m3TR4kr!";
  const hashedPassword = await hash(password);

  await db.user.upsert({
    where: {
      email,
    },
    create: {
      username: "crash.bandicoot",
      verified: true,
      password: hashedPassword,
      email,
    },
    update: {
      password: hashedPassword,
    },
  });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = `${config.projects[0]?.use.baseURL}/auth/sign-in`;

  await signIn({ page, url, email, password });

  await page.context().storageState({ path: "userStorageState.json" });
  await browser.close();
};

export default globalSetup;
