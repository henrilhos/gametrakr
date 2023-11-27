import { describe, expect, it, vi } from "vitest";
import ConfirmAccount from "~/components/emails/confirm-account";

describe("confirm account email", () => {
  it("should render the component with default props", () => {
    const email = {
      confirmAccount: ConfirmAccount,
    };
    const spy = vi.spyOn(email, "confirmAccount");

    email.confirmAccount({ href: "" });
    expect(spy).toBeCalled();
  });
});
