'use client';

import { useEffect, useTransition } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { updatePreferencesAction } from '@/lib/actions/account';

export function ThemeToggle({ initialDarkMode }: { initialDarkMode: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [pending, start] = useTransition();

  useEffect(() => {
    setTheme(initialDarkMode ? 'dark' : 'light');
  }, [initialDarkMode, setTheme]);

  const isDark = resolvedTheme ? resolvedTheme === 'dark' : initialDarkMode;

  const toggleTheme = () => {
    const next = !isDark;
    setTheme(next ? 'dark' : 'light');

    start(async () => {
      const result = await updatePreferencesAction({ darkMode: next });
      if (result.error) {
        setTheme(isDark ? 'dark' : 'light');
        toast.error(result.error);
      } else {
        toast.success('Preferencias guardadas');
      }
    });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={pending}
      className="fixed right-6 top-6 z-30 flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-card/85 text-primary shadow-[0_10px_30px_-18px_rgba(42,50,86,0.65)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-60"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
