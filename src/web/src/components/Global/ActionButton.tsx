'use client';

import Image from 'next/image';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: string;
  className?: string;
  variant?: 'fill' | 'outline';
}

export function ActionButton({ title = '', icon, variant = 'fill', className = '', ...props }: ActionButtonProps) {
  const variants = {
    fill: 'bg-[var(--button-active)] text-[var(--button-text-active)] border-[var(--button-text-active)] cursor-pointer',

    outline:
      'bg-[var(--button-inactive)] text-[var(--button-text-inactive)] border-[var(--button-text-inactive)] cursor-pointer',
  };

  const hasTitle = !!title;
  const hasIcon = !!icon;

  let padding = '';

  if (hasTitle && hasIcon) {
    padding = 'pl-[20px] pr-[12px] py-[4px] gap-2';
  } else if (hasTitle) {
    padding = 'px-8 py-2';
  } else if (hasIcon) {
    padding = 'p-1';
  }

  return (
    <button
      {...props}
      className={`flex items-center justify-center border-2 rounded-xs ${variants[variant]} ${padding} ${className} cursor-pointer transition-colors disabled:cursor-not-allowed
  disabled:opacity-50 hover:opacity-80`}
    >
      {hasTitle && <span className="font-bold uppercase font-serif align-middle leading-none">{title}</span>}

      {hasIcon && (
        <figure className="w-1/2">
          <Image src={icon} alt={title} width={64} height={40} />
        </figure>
      )}
    </button>
  );
}
