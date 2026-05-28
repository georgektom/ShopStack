import { describe, expect, it } from "vitest";
import { SHIPPING_METHODS } from "./shipping-methods.js";

describe("shipping methods", () => {
  it("defines the expected shipping options", () => {
    expect(Object.keys(SHIPPING_METHODS)).toEqual(["standard", "express", "overnight"]);
  });

  it("uses increasing costs for faster shipping", () => {
    expect(SHIPPING_METHODS.standard.cost).toBeLessThan(SHIPPING_METHODS.express.cost);
    expect(SHIPPING_METHODS.express.cost).toBeLessThan(SHIPPING_METHODS.overnight.cost);
  });
});
