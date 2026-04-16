type QuantitySelectorProps = {
  quantity: number;
  onChange: (nextValue: number) => void;
  max?: number;
};

export function QuantitySelector({ quantity, onChange, max = 10 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5">
      <button
        className="h-10 w-10 text-lg text-stone-300 transition hover:text-white"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        type="button"
      >
        -
      </button>
      <span className="min-w-10 text-center text-sm">{quantity}</span>
      <button
        className="h-10 w-10 text-lg text-stone-300 transition hover:text-white"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        type="button"
      >
        +
      </button>
    </div>
  );
}
