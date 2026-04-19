'use client';

import { useEffect, useRef, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import type { GridReadyEvent } from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';

import { ActionButton } from '@/components';

interface DataGridProps {
  columnDefs: any[];
  rowData: any[];
}

function onRowClicked(params: any) {
  console.log(params.data);
}

export function DataGrid({ columnDefs, rowData }: DataGridProps) {
  const gridRef = useRef<AgGridReact>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const defaultColDef = {
    flex: 2,
    cellClass: 'flex items-center justify-center font-serif font-bold tracking-wider px-2',
    headerClass: 'text-center font-serif font-bold text-xl uppercase',
  };

  function onGridReady(params: GridReadyEvent) {
    const api = params.api;

    setCurrentPage(api.paginationGetCurrentPage());
    setTotalPages(api.paginationGetTotalPages());
  }

  function onPaginationChanged() {
    const api = gridRef.current?.api;
    if (!api) return;

    setCurrentPage(api.paginationGetCurrentPage());
    setTotalPages(api.paginationGetTotalPages());
  }

  useEffect(() => {
    onPaginationChanged();
  }, [rowData]);

  return (
    <section className="h-120 w-full ag-theme-custom rounded-2xl px-8">
      <AgGridReact
        ref={gridRef}
        theme={'legacy'}
        rowData={rowData}
        onGridReady={onGridReady}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowHeight={73}
        paginationPageSize={6}
        headerHeight={40}
        onRowClicked={onRowClicked}
        overlayNoRowsTemplate="Nada encontrado para essa tabela"
        suppressCellFocus
        suppressDragLeaveHidesColumns
        pagination
        suppressPaginationPanel
        onPaginationChanged={onPaginationChanged}
      />

      <div className="flex items-center justify-center gap-4 mt-4">
        <ActionButton
          title="Anterior"
          onClick={() => gridRef.current?.api.paginationGoToPreviousPage()}
          disabled={currentPage === 0}
        />

        <span className="font-bold font-serif text-2xl text-(--text)">
          Página {currentPage + 1} de {totalPages}
        </span>

        <ActionButton
          title="Próxima"
          onClick={() => gridRef.current?.api.paginationGoToNextPage()}
          disabled={currentPage === totalPages - 1}
        />
      </div>
    </section>
  );
}
