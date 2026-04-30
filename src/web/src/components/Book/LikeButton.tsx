'use client';

import { ActionButton } from '@/components';

type LikeButtonProps = {
  isFavorite: boolean;
  onToggle: () => void;
};

export function LikeButton({ isFavorite, onToggle }: LikeButtonProps) {
  return (
    <ActionButton
      icon={isFavorite ? '/assets/active-like-button.svg' : '/assets/like-button.svg'}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
    />
  );
}
