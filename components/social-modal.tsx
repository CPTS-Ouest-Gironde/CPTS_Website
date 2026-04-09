"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Linkedin, Facebook, Instagram, UserPlus } from "lucide-react"
import Link from "next/link"

interface SocialModalProps {
  isOpen: boolean
  onClose: () => void
  showAdhesionCta?: boolean
}

export function SocialModal({ isOpen, onClose, showAdhesionCta = true }: SocialModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Rejoignez-nous</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <p className="text-center text-muted-foreground text-sm">
            Suivez-nous sur les réseaux sociaux pour rester informé de nos actualités
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.linkedin.com/company/cpts-ouest-gironde"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-muted transition-colors group"
              aria-label="LinkedIn"
            >
              <div className="w-16 h-16 rounded-full bg-[#0A66C2] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Linkedin className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-semibold">LinkedIn</span>
            </a>

            <a
              href="https://www.facebook.com/cptsouestgironde/?locale=fr_FR"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-muted transition-colors group"
              aria-label="Facebook"
            >
              <div className="w-16 h-16 rounded-full bg-[#1877F2] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Facebook className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-semibold">Facebook</span>
            </a>

            <a
              href="https://www.instagram.com/cptsouestgironde/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-muted transition-colors group"
              aria-label="Instagram"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-semibold">Instagram</span>
            </a>
          </div>

          {showAdhesionCta && (
            <div className="mt-4 pt-6 border-t border-border space-y-3">
              <p className="text-center text-sm text-muted-foreground">
                Vous êtes professionnel de santé ?
              </p>
              <Link href="/professionnels/adhesion" onClick={onClose} className="block">
                <Button
                  size="lg"
                  className="w-full rounded-full font-semibold text-base h-12 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adhérer
                </Button>
              </Link>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
