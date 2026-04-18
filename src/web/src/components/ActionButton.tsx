'use client';

import Image from 'next/image';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: string;
  className?: string;
  variant?: 'fill' | 'outline';
}

export function ActionButton({ title = '', icon, variant = 'fill', className = '', style }: ActionButtonProps) {
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
    padding = 'px-8 py-2';
  } else if (hasIcon) {
    padding = 'p-1';
  }

  return (
    <button
      style={style}
      className={`flex items-center justify-center border-2 rounded-xs ${variants[variant]} ${padding} ${className}`}
    >
      {hasTitle && <span className="text-xl font-bold uppercase font-serif align-middle leading-none">{title}</span>}

      {hasIcon && (
        <figure className="w-1/2">
          <Image src={icon} alt={title} width={64} height={40} />
        </figure>
      )}
    </button>
  );
}
