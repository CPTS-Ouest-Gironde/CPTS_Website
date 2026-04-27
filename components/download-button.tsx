import { Download } from "lucide-react";

interface DownloadButtonProps {
  fileName: string;
  fileUrl: string;
  className?: string;
}

export function DownloadButton({
  fileName,
  fileUrl,
  className = "",
}: DownloadButtonProps) {
  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative flex items-center w-full px-6 py-4 bg-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-700 hover:shadow-xl hover:scale-[1.02] group overflow-hidden ${className}`}
      aria-label={`Télécharger ${fileName}`}
    >
      {/* Icône fixe pour garder un alignement constant */}
      <Download
        className="absolute left-6 sm:left-8 w-5 h-5 flex-shrink-0"
        aria-hidden="true"
      />

      {/* Nom du fichier - disparaît au hover */}
      <span className="w-full text-center pl-10 pr-2 transition-all duration-300 group-hover:opacity-0 group-hover:scale-90">
        <span className="block truncate">{fileName}</span>
      </span>

      {/* Texte "Télécharger" - apparaît au hover */}
      <span className="absolute inset-0 flex items-center justify-center pl-10 pr-2 opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
        <span className="block truncate">Télécharger</span>
      </span>
    </a>
  );
}
