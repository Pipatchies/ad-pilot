'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SvgSearch from './icons/Search';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type SearchBarProps = {
  variant?: 'minimal' | 'full';
  onQueryChange: (q: string) => void;
  onDateSortChange?: (dir: 'desc' | 'asc') => void;
  defaultDateSort?: 'desc' | 'asc';
};

export default function SearchBar({
  variant = 'full',
  onQueryChange,
  onDateSortChange,
  defaultDateSort = 'desc',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState(
    defaultDateSort === 'desc' ? 'Du plus récent au plus ancien' : 'Du plus ancien au plus récent',
  );

  useEffect(() => {
    onQueryChange(query);
  }, [query, onQueryChange]);

  const pickSort = (label: string, dir: 'desc' | 'asc') => {
    setSortLabel(label);
    onDateSortChange?.(dir);
    setIsOpen(false);
  };

  return (
    <div className='flex flex-col md:flex-row items-center gap-6 py-2 w-full max-w-2xl'>
      <div className='flex items-center gap-2 flex-1 border-b border-[#A5A4BF] pb-2 grow'>
        <SvgSearch className='w-5 fill-[#BCBCCB]' />
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Rechercher'
          className='flex-1 bg-transparent outline-none placeholder:text-primary text-sm font-[400] '
        />
      </div>

      {variant === 'full' && (
        <div className='w-full md:w-72 relative'>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant='outline'
                className='w-full justify-between border-primary cursor-pointer'
              >
                <span>{sortLabel}</span>
                <ChevronDown className='h-4 w-4 color-primary transition-transform group-data-[state=open]/collapsible:rotate-180' />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='absolute z-10 w-full bg-white mt-1 border border-primary rounded-md overflow-hidden shadow-lg'>
              <Button
                variant='ghost'
                className='w-full justify-start rounded-none cursor-pointer'
                onClick={() => pickSort('Du plus récent au plus ancien', 'desc')}
              >
                Du plus récent au plus ancien
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start rounded-none cursor-pointer'
                onClick={() => pickSort('Du plus ancien au plus récent', 'asc')}
              >
                Du plus ancien au plus récent
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
}
