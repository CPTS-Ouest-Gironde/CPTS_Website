import { Facebook, Instagram, Linkedin, Mail } from "lucide-react"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 bg-gradient-to-br from-slate-50 to-gray-100 border-t border-gray-200 py-8 lg:py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center bg-white rounded-xl p-2 shadow-sm">
            <Image
              src="/favicon.svg"
              alt="CPTS Ouest Gironde"
              width={130}
              height={87}
              className="w-[100px] sm:w-[115px] lg:w-[130px] h-auto object-contain"
              style={{ height: "auto" }}
              loading="lazy"
              sizes="(max-width: 640px) 100px, (max-width: 1024px) 115px, 130px"
            />
          </div>

          {/* Center - Copyright (hidden on mobile, shown on desktop between logo and social) */}
          <div className="hidden lg:block text-gray-600 text-sm">
            <p>© {currentYear} CPTS Ouest Gironde. Tous droits réservés.</p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/cptsouestgironde/?locale=fr_FR"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white shadow-sm hover:bg-primary hover:scale-110 flex items-center justify-center transition-all duration-300 text-gray-700 hover:text-white"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/cptsouestgironde/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white shadow-sm hover:bg-primary hover:scale-110 flex items-center justify-center transition-all duration-300 text-gray-700 hover:text-white"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/cpts-ouest-gironde"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white shadow-sm hover:bg-primary hover:scale-110 flex items-center justify-center transition-all duration-300 text-gray-700 hover:text-white"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:contact@cpts-ouestgironde.fr"
              className="w-10 h-10 rounded-full bg-white shadow-sm hover:bg-primary hover:scale-110 flex items-center justify-center transition-all duration-300 text-gray-700 hover:text-white"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright on mobile - centered below */}
          <div className="lg:hidden text-center text-gray-600 text-sm w-full">
            <p>© {currentYear} CPTS Ouest Gironde. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
