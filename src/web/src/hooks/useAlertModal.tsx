'use client';

import { useState } from 'react';
import { AlertModal } from '@/components';

type ModalState = {
  isOpen: boolean;
  type: 'error' | 'success' | 'confirmation';
  title: string;
  description?: string;
  onSuccess?: () => void;
};

export function useAlertModal() {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'error',
    title: '',
    description: '',
  });

  function close() {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }

  function showSuccess(title: string, description?: string, onClose?: () => void) {
    setModal({
      isOpen: true,
      type: 'success',
      title,
      description,
      onSuccess: onClose,
    });
  }

  function showError(title: string, description?: string) {
    setModal({
      isOpen: true,
      type: 'error',
      title,
      description,
    });
  }

  function showConfirmation(title: string, description: string, onConfirm: () => void) {
    setModal({
      isOpen: true,
      type: 'confirmation',
      title,
      description,
      onSuccess: onConfirm,
    });
  }

  const ModalComponent = modal.isOpen ? (
    <AlertModal
      type={modal.type}
      title={modal.title}
      description={modal.description}
      onClose={() => {
        close();
        if (modal.type === 'success') {
          modal.onSuccess?.();
        }
      }}
      onConfirm={() => {
        close();
        modal.onSuccess?.();
      }}
    />
  ) : null;

  return {
    showSuccess,
    showError,
    showConfirmation,
    ModalComponent,
  };
}
