import { useState } from 'react';

type ModalState = {
  visible: boolean;
  type: 'error' | 'success' | 'confirmation';
  title: string;
  description?: string;
  onSuccess?: () => void;
};

export function useAlertModal() {
  const [modal, setModal] = useState<ModalState>({
    visible: false,
    type: 'error',
    title: '',
    description: '',
  });

  function close() {
    setModal((prev) => ({
      ...prev,
      visible: false,
    }));
  }

  function showSuccess(title: string, description?: string, onSuccess?: () => void) {
    setModal({
      visible: true,
      type: 'success',
      title,
      description,
      onSuccess,
    });
  }

  function showError(title: string, description?: string, onSuccess?: () => void) {
    setModal({
      visible: true,
      type: 'error',
      title,
      description,
      onSuccess,
    });
  }

  function showConfirmation(title: string, description: string, onSuccess: () => void) {
    setModal({
      visible: true,
      type: 'confirmation',
      title,
      description,
      onSuccess,
    });
  }

  return {
    modal,
    close,
    showSuccess,
    showError,
    showConfirmation,
  };
}
