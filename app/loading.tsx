export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 overflow-hidden bg-primary/10">
      <div className="h-full bg-primary animate-pulse" />
    </div>
  )
}
