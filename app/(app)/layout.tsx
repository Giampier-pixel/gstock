import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { DecorativeBlobs } from '@/components/layout/decorative-blobs';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const name = session.user.name ?? 'Usuario';
  const initials = name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="flex h-screen bg-background font-sans text-foreground selection:bg-accent selection:text-foreground overflow-hidden relative">
      <DecorativeBlobs />
      <Sidebar userName={name} userInitials={initials} />
      <main className="flex-1 overflow-auto p-8 h-full">
        <div className="max-w-[1000px] mx-auto flex flex-col h-full pt-2">
          {children}
        </div>
      </main>
    </div>
  );
}
