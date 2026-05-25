'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FilterDropdown({ options }: { options: string[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0] ?? 'Categoría');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="h-9 px-3 rounded-lg border-primary/20 bg-card/50 hover:bg-card text-foreground shadow-sm transition-all text-sm flex items-center gap-2"
      >
        <Filter size={16} />
        {selected}
      </Button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-44 rounded-lg border border-primary/20 bg-popover p-1 text-popover-foreground shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={selected === option}
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:outline-none"
            >
              {option}
              {selected === option && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
