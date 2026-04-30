'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Props = {
  isbn: string;
};

export function BookCoverPreview({ isbn }: Props) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    const clean = isbn.replace(/-/g, '').trim();
    const timer = setTimeout(() => {
      if (clean.length < 10) {
        setCoverUrl(null);
        setCoverError(false);
        return;
      }
      setCoverUrl(`https://covers.openlibrary.org/b/isbn/${clean}-L.jpg?default=false`);
      setCoverError(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [isbn]);

  return (
    <div className="flex justify-center mb-2">
      <div
        className="w-28 h-40 border border-(--text)/30 flex items-center justify-center overflow-hidden shrink-0"
        style={{ background: 'var(--foreground)' }}
      >
        {coverUrl && !coverError ? (
          <Image
            key={coverUrl}
            src={coverUrl}
            alt="Capa do livro"
            width={112}
            height={160}
            className="object-cover w-full h-full"
            onError={() => setCoverError(true)}
            unoptimized
          />
        ) : (
          <span className="font-sans text-[10px] text-(--text)/40 text-center px-2">
            {isbn.replace(/-/g, '').trim().length >= 10
              ? 'Capa não encontrada'
              : 'Digite o ISBN'}
          </span>
        )}
      </div>
    </div>
  );
}
