import React from 'react'
import { Domaine, Television } from '@/components/icons'
import Typography from '@/components/typography'
import StepCard from './components/step-card'
import BudgetCard from './components/budget-card'

const stepCardData = [
  {
    id: 1,
    label: "Brief",
    status: "completed",
  },
  {
    id: 2,
    label: "Création",
    status: "completed",
  },
  {
    id: 3,
    label: "Validation",
    status: "completed",
  },
  {
    id: 4,
    label: "Diffusion en cours",
    status: "current",
  },
  {
    id: 5,
    label: "Bilan",
    status: "upcoming",
  },
]

const budgetCardData = {
  price: 1550,
}

export default function Campaign() {
  return (
    <div>
      <Typography variant='h1'>Titre de la campagne</Typography>
      <div className='flex flex-wrap gap-x-3 mt-0 mb-10'>
        <Domaine />
        <Television />
        <Typography variant="h4">Campagne digitale et télé</Typography>
      </div>
      <Typography variant="h2">
        Récap de la campagne
      </Typography>
      <div className='grid grid-cols-1 md:grid-cols-6 gap-10 mr-50'>
      <div className="md:col-span-4">
      <StepCard steps={stepCardData} />
      </div>
      <div className="md:col-span-2">
      <BudgetCard price={budgetCardData.price} />
      </div>
      </div>
    </div>
  )
}
