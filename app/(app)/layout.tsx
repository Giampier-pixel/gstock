import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { DecorativeBlobs } from '@/components/layout/decorative-blobs';
import { PageTransition } from '@/components/layout/page-transition';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { ChatWidget } from '@/components/features/assistant/chat-widget';
import { apiFetch } from '@/lib/api/client';
import type { ApiUser } from '@/lib/api/types';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  let name = session.user.name ?? 'Usuario';
  let darkMode = session.user.darkMode ?? false;
  try {
    const me = await apiFetch<ApiUser>('/v1/auth/me');
    name = me.name;
    darkMode = me.darkMode;
  } catch {
    // Fall back to session name if the API is unreachable.
  }
  const initials = name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="flex h-screen bg-background font-sans text-foreground selection:bg-accent selection:text-foreground overflow-hidden relative">
      <DecorativeBlobs />
      <Sidebar userName={name} userInitials={initials} />
      <ThemeToggle initialDarkMode={darkMode} />
      <main className="flex-1 overflow-auto p-8 h-full">
        <div className="max-w-[1000px] mx-auto flex flex-col h-full pt-2">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}
