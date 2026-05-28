import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuantitySelector } from "./QuantitySelector";

describe("QuantitySelector", () => {
  it("increments quantity until the max", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { getByRole } = render(<QuantitySelector max={3} onChange={onChange} quantity={2} />);

    const incrementButton = getByRole("button", { name: /increase quantity/i });
    await user.click(incrementButton);
    await user.click(incrementButton);

    expect(onChange).toHaveBeenNthCalledWith(1, 3);
    expect(onChange).toHaveBeenNthCalledWith(2, 3);
  });

  it("disables decrementing below one", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { getByRole } = render(<QuantitySelector onChange={onChange} quantity={1} />);

    const decrementButton = getByRole("button", { name: /decrease quantity/i });
    expect(decrementButton).toBeDisabled();

    await user.click(decrementButton);

    expect(onChange).not.toHaveBeenCalled();
  });
});
