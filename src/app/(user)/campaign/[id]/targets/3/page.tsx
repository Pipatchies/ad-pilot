import Typography from '@/components/typography';
import React from 'react';
import TargetDetails from '../components/target-details';

const targetData = [
  {
    title: 'Opinions et attitudes',
    header: {
      survey: 'France TGI (Français) 2024R2 Octobre',
      zoom: 'Opinions et attitudes',
      filter: 'Interviewé: Age : 5 tranches: 15 à 24 ans',
      sector: 'MOI JE',
      subject:
        "Esprit citoyen : Attitudes citoyennes: Attitudes pro-environnement et citoyennes: Tous degrés d'acquiescement",
    },
    scale: 19,
    size: 4.62,
    card: [
      {
        legend: 'Les gens ont le devoir de recycler',
        percentage: 72,
        key: 102,
      },
      {
        legend: 'Je fais de réels efforts pour recycler',
        percentage: 64,
        key: 96,
      },
      {
        legend: "On s'inquiète trop au sujet de l'environnement",
        percentage: 27,
        key: 97,
      },
      {
        legend: 'Les marques ont tendance à négliger les personnes âgées',
        percentage: 52,
        key: 97,
      },
    ],
  },
  {
    title: 'Couverture médiatique',
    header: {
      survey: 'France TGI (Français) 2024R2 Octobre',
      zoom: 'Couv. Média',
      filter: 'Interviewé: Age : 5 tranches: 15 à 24 ans',
      sector: 'TOUCHPOINTS',
      subject: 'TOUCHPOINTS COUVERTURE HEBDO: Touchpoints Couvertures hebdomadaires',
    },
    scale: 19,
    size: 4.62,
    card: [
      {
        legend: 'Internet tous supports',
        percentage: 98,
        key: 100,
      },
      {
        legend: 'Social Media',
        percentage: 97,
        key: 100,
      },
      {
        legend: 'Smartphone',
        percentage: 93,
        key: 103,
      },
      {
        legend: 'Affichage',
        percentage: 82,
        key: 103,
      },
    ],
  },
];

export default function Target3() {
  return (
    <section>
      <Typography variant='h1'>Titre de la campagne</Typography>
      <Typography variant='h1' className='mb-10 font-bold'>
        Titre de la cible
      </Typography>
      <div className='space-y-20'>
        {targetData.map((item, index) => (
          <TargetDetails
            key={index}
            title={item.title}
            header={item.header}
            scale={item.scale}
            size={item.size}
            card={item.card}
          />
        ))}
      </div>
    </section>
  );
}
