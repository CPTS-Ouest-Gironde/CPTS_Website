/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [62, 68, 70, 72, 75, 85, 90],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/presentation-de-la-cpts-ouest-gironde',
        destination: '/presentation',
        permanent: true,
      },
      {
        source: '/professionnels-de-sante',
        destination: '/professionnels/adhesion',
        permanent: true,
      },
      {
        source: '/mon-espace-de-sante',
        destination: '/patients/mon-espace-sante',
        permanent: true,
      },
      {
        source: '/avez-vous-un-medecin-traitant',
        destination: '/patients/medecin-traitant',
        permanent: true,
      },
      {
        source: '/vos-numeros-utiles',
        destination: '/patients/coordonnees',
        permanent: true,
      },
      {
        source: '/demande-orientation-psy',
        destination: '/espace-pro/demande-orientation-psy',
        permanent: true,
      },
      {
        source: '/prevention/sante-familiale/vaccination-papillomavirus-campagne-scolaire-2025',
        destination: '/prevention/sante-familiale/vaccination-papillomavirus-campagne-scolaire-2026',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
