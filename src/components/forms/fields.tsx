export const inputCls =
  "w-full border-2 border-brand-ink bg-brand-paper px-4 py-3 text-brand-ink outline-none focus:shadow-offset-sm";

export function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1 block text-sm font-bold uppercase tracking-wide text-brand-ink">
        {label}
        {required ? <span className="text-brand-red"> *</span> : null}
      </span>
      {children}
      {error?.length ? (
        <span className="mt-1 block text-xs font-bold text-brand-red">{error[0]}</span>
      ) : null}
    </label>
  );
}
