import { afterAll, beforeAll, beforeEach } from "vitest";
import {
  resetTestDatabase,
  startTestDatabase,
  stopTestDatabase,
} from "./database";

beforeAll(async () => {
  await startTestDatabase();
});

beforeEach(async () => {
  await resetTestDatabase();
});

afterAll(async () => {
  await stopTestDatabase();
});
