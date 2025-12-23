import CtaButton from '@/components/cta-button'
import SvgCrayon from '@/components/icons/Crayon'
import Typography from '@/components/typography'
import { CldImage } from 'next-cloudinary'
import React from 'react'

const CtaProps = {
  text: "Créer une campagne",
  url: "/admin/new-campaign",
  target: "self",
};

export default function SpaceOrgnizationDetailsHeader({ organization }: { organization: any }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {organization.logo && (
          <CldImage
            src={organization.logo}
            width={90}
            height={90}
            alt={organization.name}
            className="object-cover"
          />
        )}
        <Typography variant="h1" className="mb-0">{organization.name}</Typography>
      </div>
      <CtaButton props={CtaProps} icon={<SvgCrayon />} />      
    </div>
  )
}
