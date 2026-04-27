"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogOut } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { VariantProps } from "class-variance-authority"

type SignOutButtonProps = VariantProps<typeof buttonVariants> & {
  className?: string
  label?: string
  redirectTo?: string
}

export function SignOutButton({
  className,
  label = "Se déconnecter",
  redirectTo = "/login",
  size = "default",
  variant = "outline",
}: SignOutButtonProps) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignOut() {
    setIsLoading(true)
    await supabase.auth.signOut()
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <Button
      type="button"
      onClick={handleSignOut}
      disabled={isLoading}
      className={className}
      size={size}
      variant={variant}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Déconnexion...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}
