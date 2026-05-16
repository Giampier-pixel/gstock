import { DecorativeBlobs } from '@/components/layout/decorative-blobs';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background font-sans text-foreground overflow-hidden relative">
      <DecorativeBlobs variant="auth" />
      {children}
    </div>
  );
}
