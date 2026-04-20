'use client';

import '@/lib/AgGrid';

import { useEffect, useState } from 'react';
import { ActionButton, DataGrid, gridConfigs, Header, mockData } from '@/components';
import { getBooks } from '@/services/Books';

import { formatBook } from '@/util/Formatter';

type ViewMode = 'livros' | 'emprestimos' | 'historico';

export default function ControlPanel() {
  useEffect(() => {
    async function loadBooks() {
      const data = await getBooks();
      setBooks((data ?? []).map(formatBook));
    }

    loadBooks();
  }, []);

  const [books, setBooks] = useState([]);

  const [activeView, setActiveView] = useState<ViewMode>('livros');

  const config = gridConfigs[activeView];
  const rowData = activeView === 'livros' ? books : mockData[activeView];

  return (
    <>
      <Header />

      <main className="min-h-[80vh] flex flex-col gap-6 bg-(--background) mb-8 overflow-x-hidden">
        <section className=" flex flex-row mt-8 mx-8 justify-between">
          <div className="flex flex-row gap-4">
            <ActionButton
              title="Livros"
              variant={activeView === 'livros' ? 'fill' : 'outline'}
              onClick={() => setActiveView('livros')}
            />

            <ActionButton
              title="Empréstimos"
              variant={activeView === 'emprestimos' ? 'fill' : 'outline'}
              onClick={() => setActiveView('emprestimos')}
            />

            <ActionButton
              title="Histórico"
              variant={activeView === 'historico' ? 'fill' : 'outline'}
              onClick={() => setActiveView('historico')}
            />
          </div>

          {activeView !== 'historico' && <ActionButton title="Adicionar" />}
        </section>

        <DataGrid key={activeView} columnDefs={config.columnDefs} rowData={rowData} />
      </main>
    </>
  );
}
