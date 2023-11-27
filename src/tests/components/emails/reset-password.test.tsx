import { describe, expect, it, vi } from "vitest";
import ResetPassword from "~/components/emails/reset-password";

describe("confirm account email", () => {
  it("should render the component with default props", () => {
    const email = {
      resetPassword: ResetPassword,
    };
    const spy = vi.spyOn(email, "resetPassword");

    email.resetPassword({ href: "" });
    expect(spy).toBeCalled();
  });
});
