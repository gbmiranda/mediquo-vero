import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import { Input } from './input';
import { cn } from '@/utils/utils';

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  mask: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, value = '', onChange, className, ...props }, ref) => {
    const applyMask = useCallback((inputValue: string, maskPattern: string): string => {
      // Remove todos os caracteres não numéricos
      const cleanValue = inputValue.replace(/\D/g, '');

      let maskedValue = '';
      let valueIndex = 0;

      for (let i = 0; i < maskPattern.length && valueIndex < cleanValue.length; i++) {
        if (maskPattern[i] === '9') {
          maskedValue += cleanValue[valueIndex];
          valueIndex++;
        } else {
          maskedValue += maskPattern[i];
        }
      }

      return maskedValue;
    }, []);

    const removeMask = useCallback((maskedValue: string): string => {
      return maskedValue.replace(/\D/g, '');
    }, []);

    // Calcular o valor inicial mascarado
    const getInitialMaskedValue = useCallback(() => {
      if (!value) return '';
      return applyMask(removeMask(value), mask);
    }, [value, mask, applyMask, removeMask]);

    const [displayValue, setDisplayValue] = useState(getInitialMaskedValue);

    // Sincronizar com mudanças externas do value
    useEffect(() => {
      const newMaskedValue = getInitialMaskedValue();
      setDisplayValue(newMaskedValue);
    }, [getInitialMaskedValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      const rawValue = removeMask(inputValue);
      const maskedValue = applyMask(rawValue, mask);

      // Atualizar o valor exibido
      setDisplayValue(maskedValue);

      // Criar um evento sintético para o componente pai
      if (onChange) {
        const customEvent = {
          ...event,
          target: {
            ...event.target,
            name: props.name || '',
            value: maskedValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(customEvent);
      }
    };

    return (
      <Input
        ref={ref}
        {...props}
        value={displayValue}
        onChange={handleChange}
        className={cn(className)}
      />
    );
  }
);

MaskedInput.displayName = 'MaskedInput';

export { MaskedInput };
