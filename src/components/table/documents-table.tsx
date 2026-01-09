'use client';

import { useState } from 'react';
import { DataTable, sortableHeader } from '@/components/table/data-table';
import SvgEyeIcon from '@/components/icons/EyeIcon';
import SvgUploder from '@/components/icons/Uploder';
import { ColumnDef } from '@tanstack/react-table';
import { Document } from '@/types/docs';
import MediaViewerModal from '@/components/modal/media-viewer-modal';
import UpdateDocumentModal from '@/components/modal/update/update-document-modal';
import DeleteModal from '../modal/delete-modal';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface DocumentsTableProps {
  documents: Document[];
  showCampaign?: boolean;
  showClient?: boolean;
  globalFilter?: string;
  headerClassName?: string;
  readOnly?: boolean;
}

export default function DocumentsTable({
  documents,
  showCampaign = false,
  showClient = false,
  globalFilter,
  headerClassName,
  readOnly,
}: DocumentsTableProps) {
  const deleteDocument = useMutation(api.mutations.documents.deleteDocument);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);

  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: 'title',
      header: sortableHeader('Titre du document'),
      cell: ({ row }) => row.getValue('title'),
    },
    ...(showCampaign
      ? [
          {
            accessorKey: 'campaignTitle',
            header: sortableHeader('Campagne'),
            cell: ({ row }: { row: any }) => (
              <span className='font-bold underline'>{row.getValue('campaignTitle')}</span>
            ),
          },
        ]
      : []),
    ...(showClient
      ? [
          {
            accessorKey: 'organizationName',
            header: sortableHeader('Client'),
            cell: ({ row }: { row: any }) => (
              <span className='font-bold'>{row.getValue('organizationName')}</span>
            ),
          },
        ]
      : []),
    {
      accessorKey: 'type',
      header: sortableHeader('Type de fichier'),
      cell: ({ row }) => row.getValue('type'),
    },
    {
      accessorKey: '_creationTime',
      header: sortableHeader("Date d'import"),
      cell: ({ row }) => {
        const ts = row.getValue('_creationTime') as number | undefined;
        return ts ? new Date(ts).toLocaleDateString('fr-FR') : '-';
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className='flex justify-end gap-4'>
          <button
            onClick={() => setViewingDocument(row.original)}
            className='hover:opacity-80 transition-opacity cursor-pointer'
          >
            <SvgEyeIcon />
          </button>

          {!readOnly && row.original._id && (
            <UpdateDocumentModal
              documentId={row.original._id}
              defaultValues={{
                title: row.original.title,
              }}
            />
          )}

          {row.original.url && (
            <a
              href={
                row.original.url.includes('/upload/')
                  ? row.original.url.replace('/upload/', '/upload/fl_attachment/')
                  : row.original.url
              }
              download
              className='hover:opacity-80 transition-opacity'
            >
              <SvgUploder />
            </a>
          )}

          {!readOnly && row.original._id && (
            <DeleteModal
              onConfirm={() =>
                deleteDocument({
                  documentId: row.original._id!,
                })
              }
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={documents}
        columns={columns}
        globalFilter={globalFilter}
        emptyMessage='Aucun document pour le moment.'
        headerClassName={headerClassName}
        defaultSort={{ id: '_creationTime', desc: true }}
      />

      {viewingDocument && (
        <MediaViewerModal
          isOpen={true}
          mediaItem={viewingDocument}
          onClose={() => setViewingDocument(null)}
          onNext={() => {
            const idx = documents.indexOf(viewingDocument);
            if (idx !== -1 && idx < documents.length - 1) {
              setViewingDocument(documents[idx + 1]);
            }
          }}
          onPrev={() => {
            const idx = documents.indexOf(viewingDocument);
            if (idx > 0) {
              setViewingDocument(documents[idx - 1]);
            }
          }}
          hasNext={documents.indexOf(viewingDocument) < documents.length - 1}
          hasPrev={documents.indexOf(viewingDocument) > 0}
        />
      )}
    </>
  );
}
