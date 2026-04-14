'use client';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: React.ReactNode;
  variant?: 'fill' | 'outline';
}

export function ActionButton({ title = '', icon, variant = 'fill', ...props }: ActionButtonProps) {
  const variants = {
    fill: 'bg-[var(--button-active)] text-[var(--button-text-active)] border-[var(--button-text-active)]',

    outline: 'bg-[var(--button-inactive)] text-[var(--button-text-inactive)] border-[var(--button-text-inactive)]',
  };

  const hasTitle = !!title;
  const hasIcon = !!icon;

  let padding = '';

  if (hasTitle && hasIcon) {
    padding = 'pl-[20px] pr-[12px] py-[4px] gap-2';
  } else if (hasTitle) {
    padding = 'px-[40px] py-[4px]';
  } else if (hasIcon) {
    padding = 'p-3';
  }

  return (
    <button
      className={`flex items-center justify-center border-2 rounded-xs ${variants[variant]} ${padding} `}
      {...props}
    >
      {hasTitle && <span className="text-md font-bold uppercase font-serif align-middle leading-none">{title}</span>}

      {hasIcon && <span>{icon}</span>}
    </button>
  );
}
