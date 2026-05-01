'use client';

import { useState } from 'react';

export function useFormState<T extends Record<string, any>>(initial: T) {
  const [form, setForm] = useState<T>(initial);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  }

  return { form, setForm, handleChange };
}
