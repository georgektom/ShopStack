type QuantitySelectorProps = {
  quantity: number;
  onChange: (nextValue: number) => void;
  max?: number;
};

export function QuantitySelector({ quantity, onChange, max = 10 }: QuantitySelectorProps) {
  const canDecrement = quantity > 1;
  const canIncrement = quantity < max;

  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5">
      <button
        aria-label="Decrease quantity"
        className="h-10 w-10 text-lg text-stone-300 transition hover:text-white disabled:cursor-not-allowed disabled:text-stone-600"
        disabled={!canDecrement}
        onClick={() => onChange(quantity - 1)}
        type="button"
      >
        -
      </button>
      <span className="min-w-10 text-center text-sm">{quantity}</span>
      <button
        aria-label="Increase quantity"
        className="h-10 w-10 text-lg text-stone-300 transition hover:text-white disabled:cursor-not-allowed disabled:text-stone-600"
        disabled={!canIncrement}
        onClick={() => onChange(quantity + 1)}
        type="button"
      >
        +
      </button>
    </div>
  );
}
