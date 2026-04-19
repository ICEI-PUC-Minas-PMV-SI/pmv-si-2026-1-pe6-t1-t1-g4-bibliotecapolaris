'use client';

import '@/lib/AgGrid';

import { useState } from 'react';
import { ActionButton, DataGrid, gridConfigs, Header, mockData } from '@/components';

type ViewMode = 'livros' | 'emprestimos' | 'historico';

export default function ControlPanel() {
  const [activeView, setActiveView] = useState<ViewMode>('livros');

  const config = gridConfigs[activeView];
  const rowData = mockData[activeView];

  return (
    <>
      <Header />

      <main className="min-h-[80vh] flex flex-col gap-6 bg-(--background) mb-8 overflow-x-hidden">
        <section className="w-full flex flex-row mt-8 ml-8 gap-4">
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
        </section>

        <DataGrid key={activeView} columnDefs={config.columnDefs} rowData={rowData} />
      </main>
    </>
  );
}
