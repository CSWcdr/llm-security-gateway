type LimitInputProps = {
    label: string;
    description: string;
    value: number;
    disabled?: boolean;
  
    onChange: (
      value: number
    ) => void;
  };
  
  export default function LimitInput({
    label,
    description,
    value,
    disabled = false,
    onChange,
  }: LimitInputProps) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <div>
          <p className="text-sm font-medium text-slate-300">
            {label}
          </p>
  
          <p className="mt-1 text-xs leading-5 text-slate-600">
            {description}
          </p>
        </div>
  
        <div className="mt-4 flex items-center">
          <input
            type="number"
            min={1}
            disabled={disabled}
            value={value}
            onChange={(event) => {
              const nextValue =
                Number(
                  event.target.value
                );
  
              if (
                Number.isFinite(
                  nextValue
                ) &&
                nextValue > 0
              ) {
                onChange(
                  nextValue
                );
              }
            }}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 disabled:cursor-not-allowed disabled:opacity-40"
          />
        </div>
      </div>
    );
  }