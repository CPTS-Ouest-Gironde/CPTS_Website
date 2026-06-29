import { defineConfig, globalIgnores } from "eslint/config"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["app/presentation/suivi-activites/page.tsx"],
    rules: {
      "react/jsx-key": "off",
    },
  },
  {
    files: [
      "app/prevention/education-therapeutique/syndrome-apnee-sommeil/page.tsx",
      "app/prevention/memos-suivi/page.tsx",
      "app/prevention/sante-familiale/mois-sans-tabac-novembre-2025/page.tsx",
      "app/prevention/sante-familiale/octobre-rose-2025/page.tsx",
      "app/prevention/sante-familiale/vaccination-anti-covid-2025/page.tsx",
    ],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  {
    files: ["components/sante-mental/videos-view.tsx"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  },
  {
    files: ["scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  globalIgnores([
    ".chatbot-tests/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
])
