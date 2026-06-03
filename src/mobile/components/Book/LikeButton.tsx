import React from 'react';

import { ActionButton } from '../Global/ActionButton';

type LikeButtonProps = {
  isFavorite: boolean;
  onToggle: () => void;
};

export function LikeButton({ isFavorite, onToggle }: LikeButtonProps) {
  return (
    <ActionButton
      icon={isFavorite ? require('@/assets/active-like-button.png') : require('@/assets/like-button.png')}
      onPress={onToggle}
    />
  );
}
