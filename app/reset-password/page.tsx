import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PasswordUpdateForm } from "@/components/auth/password-update-form"

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-10 flex items-start md:items-center">
        <section className="w-full py-8 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-xl mx-auto">
              <PasswordUpdateForm
                flow="recovery"
                title="Réinitialiser votre mot de passe"
                description="Définissez un nouveau mot de passe pour retrouver l'accès à votre espace pro."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
