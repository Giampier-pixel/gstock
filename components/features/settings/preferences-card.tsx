'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updatePreferencesAction } from '@/lib/actions/account';

interface Preferences {
  emailNotifications: boolean;
}

export function PreferencesCard({ initial }: { initial: Preferences }) {
  const [values, setValues] = useState<Preferences>(initial);
  const [pending, start] = useTransition();

  const toggle = (key: keyof Preferences) => {
    const next = !values[key];
    const prev = values[key];
    setValues((s) => ({ ...s, [key]: next }));
    start(async () => {
      const result = await updatePreferencesAction({ [key]: next });
      if (result.error) {
        setValues((s) => ({ ...s, [key]: prev }));
        toast.error(result.error);
      } else {
        toast.success('Preferencias guardadas');
      }
    });
  };

  return (
    <div className="space-y-4">
      <ToggleRow
        title="Notificaciones por correo"
        description="Recibir alertas de stock bajo y movimientos."
        active={values.emailNotifications}
        disabled={pending}
        onToggle={() => toggle('emailNotifications')}
      />
    </div>
  );
}

function ToggleRow({
  title,
  description,
  active,
  disabled,
  onToggle,
}: {
  title: string;
  description: string;
  active: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10 transition-colors hover:bg-white/10">
      <div>
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={title}
        onClick={onToggle}
        disabled={disabled}
        className={`w-10 h-6 rounded-full relative transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
          active ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200 ${
            active ? 'right-1' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}
