'use client';
import DocumentsTable from '@/components/table/documents-table';
import { useQuery } from 'convex/react';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../convex/_generated/api';
import { useParams } from 'next/navigation';

type DocumentsTableProps = {
  globalFilter: string;
  dateSort: 'desc' | 'asc';
};

export default function SpaceDocumentsTable({ globalFilter, dateSort }: DocumentsTableProps) {
  const params = useParams();
  const campaignId = params?.id as Id<'campaigns'>;

  const documents = useQuery(api.queries.documents.getDocumentsByCampaign, {
    campaignId,
  });

  const documentsData =
    documents?.map((doc) => ({
      ...doc,
    })) ?? [];

  return (
    <section>
      <div className='overflow-x-auto'>
        <DocumentsTable
          documents={documentsData}
          globalFilter={globalFilter}
          showCampaign={false}
          showClient={false}
          readOnly={true}
          dateSort={dateSort}
        />
      </div>
    </section>
  );
}
