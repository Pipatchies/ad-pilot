'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Typography from '@/components/typography';
import DocModal from '@/components/modal/docs-modal';
import DocumentsTable from '@/components/table/documents-table';
import { Document } from '@/types/docs';

interface Props {
  formDocuments: Document[];
  setFormDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}

export default function SpaceDocuments({ formDocuments, setFormDocuments }: Props) {
  return (
    <Card className='w-full rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10'>
      <CardHeader className='flex justify-between items-center'>
        <Typography variant='h2' className='mb-0'>
          Les documents
        </Typography>

        {/* Modal d'ajout */}
        <DocModal onAddDocument={(doc) => setFormDocuments((prev) => [...prev, doc])} />
      </CardHeader>

      <CardContent>
        {/* Aucun document */}
        {formDocuments.length === 0 && (
          <p className='text-center py-4 text-primary/70 italic'>Aucun document pour le moment.</p>
        )}

        {/* Tableau des docs */}
        {formDocuments.length > 0 && (
          <DocumentsTable
            documents={formDocuments}
            headerClassName='border-b border-solid border-[#A5A4BF]'
          />
        )}
      </CardContent>
    </Card>
  );
}
