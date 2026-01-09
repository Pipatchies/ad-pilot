import CampaignForm from '../../../../components/campaign-form';
import { Id } from '../../../../../convex/_generated/dataModel';
import SpaceCampaignHeader from './_sections/spaceCampaignHeader';

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: Id<'campaigns'> }>;
}) {
  const { id } = await params;
  return (
    <section className='space-y-6'>
      <SpaceCampaignHeader campaignId={id} />
      <CampaignForm campaignId={id} />
    </section>
  );
}
