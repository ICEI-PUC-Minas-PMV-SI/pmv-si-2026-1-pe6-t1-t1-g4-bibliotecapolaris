'use client';

type Props = {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string;
};

export function FormField({ label, id, children, className = '' }: Props) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label 
        htmlFor={id} 
        className="font-serif text-xs uppercase tracking-widest text-(--text)/70"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
