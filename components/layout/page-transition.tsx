'use client';

import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div
      key={pathname}
      className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out"
    >
      {children}
    </div>
  );
}
