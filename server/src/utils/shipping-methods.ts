export const SHIPPING_METHODS = {
  standard: {
    id: "standard",
    label: "Standard Shipping",
    description: "Delivers in 5-7 business days.",
    cost: 7
  },
  express: {
    id: "express",
    label: "Express Shipping",
    description: "Delivers in 2-3 business days.",
    cost: 18
  },
  overnight: {
    id: "overnight",
    label: "Overnight Shipping",
    description: "Priority next business day delivery.",
    cost: 29
  }
} as const;

export type ShippingMethodId = keyof typeof SHIPPING_METHODS;
