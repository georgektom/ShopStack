import type { CartLineItem as CartLineItemType } from "../services/api";
import { formatCurrency } from "../lib/format";
import { QuantitySelector } from "./QuantitySelector";
import { Button } from "./Button";

type CartLineItemProps = {
  item: CartLineItemType;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  disabled?: boolean;
};

export function CartLineItem({ item, onQuantityChange, onRemove, disabled }: CartLineItemProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:flex-row">
      <img
        src={item.product.image}
        alt={item.product.name}
        className="h-32 w-full rounded-[1.5rem] object-cover sm:w-40"
      />
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{item.product.category}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{item.product.name}</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-400">{item.product.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-stone-400">{formatCurrency(item.product.price)} each</div>
            <div className="mt-2 text-xl font-semibold text-white">{formatCurrency(item.lineTotal)}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <QuantitySelector
            quantity={item.quantity}
            onChange={onQuantityChange}
            max={Math.min(item.product.inventoryCount, 10)}
          />
          <Button disabled={disabled} onClick={onRemove} type="button" variant="ghost">
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
