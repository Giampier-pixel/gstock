export function DecorativeBlobs({ variant = 'app' }: { variant?: 'app' | 'auth' }) {
  if (variant === 'auth') {
    return (
      <>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-secondary/80 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-60" />
        <div className="absolute -bottom-40 -left-60 w-[700px] h-[700px] bg-primary/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply opacity-60" />
      </>
    );
  }
  return (
    <>
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-secondary/80 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-60" />
      <div className="absolute -bottom-40 left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-50" />
    </>
  );
}
