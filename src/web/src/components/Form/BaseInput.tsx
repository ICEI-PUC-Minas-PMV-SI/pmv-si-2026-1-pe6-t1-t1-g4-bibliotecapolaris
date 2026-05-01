'use client';

type BaseInputModalProps = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function BaseInputModal({ open, title, children, onClose }: BaseInputModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />

      <div className="relative w-[25vw] max-h-[90vh] border border-(--text) rounded-sm bg-(--background) flex flex-col">
        {title && (
          <div className="px-4 pt-2 bg-(--button-inactive) shrink-0">
            <h1 className="text-2xl font-semibold tracking-wide line-clamp-1">{title}</h1>
          </div>
        )}

        <div className="overflow-y-auto p-4 flex-1">{children}</div>
      </div>
    </div>
  );
}

type BaseFieldProps = {
  label: string;
  children: React.ReactNode;
  labelClassName?: string;
  className?: string;
};

export function BaseField({ label, children, labelClassName, className }: BaseFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className={`form-label ${labelClassName ?? ''}`}>{label}</label>
      {children}
    </div>
  );
}
