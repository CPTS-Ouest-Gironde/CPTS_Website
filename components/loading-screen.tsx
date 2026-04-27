export function LoadingScreen() {
  return (
    <main className="min-h-screen bg-background">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/12 to-background" />
        <div className="absolute left-[-5rem] top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-12 right-[-4rem] h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative z-10 w-full max-w-sm rounded-3xl border border-border/60 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          </div>

          <p className="text-xl font-semibold text-foreground">Chargement en cours</p>
          <p className="mt-2 text-sm text-muted-foreground">
            La page se prépare, cela ne prend que quelques secondes.
          </p>
        </div>
      </div>
    </main>
  )
}
