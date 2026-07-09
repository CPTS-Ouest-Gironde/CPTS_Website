import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import articlesData from "@/app/data/sante-de-la-femme-articles.json";

interface ArticleLink {
  id: string;
  title: string;
  dateLabel: string;
  date: string;
  image: string;
  imagePosition: string | null;
  href: string;
}

export function SanteFemmeArticles() {
  // L'ordre d'affichage est celui du JSON (ordre éditorial, pas chronologique)
  const articles = articlesData.articles as ArticleLink[];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={article.href}
          className="group block rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="relative w-full aspect-[16/10] overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={
                article.imagePosition
                  ? { objectPosition: article.imagePosition }
                  : undefined
              }
            />
          </div>

          <div className="p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-primary text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.dateLabel}</span>
            </div>

            <h3 className="text-base font-bold text-card-foreground group-hover:text-primary transition-colors leading-snug">
              {article.title}
            </h3>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary uppercase tracking-wide">
              Lire l'article
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
