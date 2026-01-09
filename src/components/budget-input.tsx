'use client';

import React from 'react';
import { Input } from '@/components/ui/input';

const BudgetInput = ({
  value,
  onChange,
  placeholder,
  className,
  ...props
}: {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <Input
      type={isFocused ? 'number' : 'text'}
      placeholder={placeholder}
      className={className}
      {...props}
      value={isFocused ? (value === 0 ? '' : (value ?? '')) : value ? `${value} €` : ''}
      onChange={(e) => {
        const val = e.target.value.replace(/[^0-9.]/g, '');
        onChange(val ? Number(val) : undefined);
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
    />
  );
};

export default BudgetInput;
