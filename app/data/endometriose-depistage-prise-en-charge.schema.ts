import { z } from "zod";

export const toneSchema = z.enum(["white", "neutral"]);

export const paragraphBlockSchema = z.object({
  type: z.literal("paragraph"),
  text: z.string(),
});

export const listBlockSchema = z.object({
  type: z.literal("list"),
  items: z.array(z.string()),
});

export const blockSchema = z.union([paragraphBlockSchema, listBlockSchema]);

export const statSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const symptomSchema = z.object({
  iconName: z.string(),
  text: z.string(),
});

export const professionalSchema = z.object({
  title: z.string(),
  iconName: z.string(),
  blocks: z.array(blockSchema),
});

export const treatmentCardSchema = z.object({
  title: z.string(),
  iconName: z.string(),
  blocks: z.array(blockSchema),
});

export const contentCardSchema = z.object({
  title: z.string(),
  iconName: z.string(),
  blocks: z.array(blockSchema),
});

export const directoryCenterSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const videoItemSchema = z.object({
  title: z.string(),
  url: z.string().url(),
});

export const resourceLinkSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string().url(),
  label: z.string(),
});

export const definitionSectionSchema = z.object({
  kind: z.literal("definition"),
  id: z.string(),
  title: z.string(),
  intro: z.array(z.string()),
  tone: toneSchema,
  blocks: z.array(blockSchema),
  factorsTitle: z.string(),
  factors: z.array(z.string()),
});

export const statsSectionSchema = z.object({
  kind: z.literal("stats"),
  id: z.string(),
  title: z.string(),
  intro: z.array(z.string()),
  tone: toneSchema,
  stats: z.array(statSchema),
  note: z.string(),
});

export const symptomesSectionSchema = z.object({
  kind: z.literal("symptomes"),
  id: z.string(),
  title: z.string(),
  intro: z.array(z.string()),
  tone: toneSchema,
  image: z.string(),
  imageAlt: z.string(),
  symptoms: z.array(symptomSchema),
  painTitle: z.string(),
  painBlocks: z.array(blockSchema),
  redFlagsTitle: z.string(),
  redFlags: z.array(z.string()),
});

export const diagnosticSectionSchema = z.object({
  kind: z.literal("diagnostic"),
  id: z.string(),
  title: z.string(),
  intro: z.array(z.string()),
  tone: toneSchema,
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  blocks: z.array(blockSchema),
});

export const professionnelsSectionSchema = z.object({
  kind: z.literal("professionnels"),
  id: z.string(),
  title: z.string(),
  intro: z.array(z.string()),
  tone: toneSchema,
  image: z.string(),
  imageAlt: z.string(),
  professionals: z.array(professionalSchema),
});

export const traitementsSectionSchema = z.object({
  kind: z.literal("traitements"),
  id: z.string(),
  title: z.string(),
  tone: toneSchema,
  image: z.string(),
  imageAlt: z.string(),
  intro: z.array(blockSchema),
  careCallout: z.string(),
  careNote: z.string(),
  treatmentCards: z.array(treatmentCardSchema),
  credit: z.string().optional(),
});

export const risquesSectionSchema = z.object({
  kind: z.literal("risques"),
  id: z.string(),
  title: z.string(),
  intro: z.array(z.string()),
  tone: toneSchema,
  risks: z.array(z.string()),
});

export const multidisciplinaireSectionSchema = z.object({
  kind: z.literal("multidisciplinaire"),
  id: z.string(),
  title: z.string(),
  intro: z.array(z.string()),
  tone: toneSchema,
  cards: z.array(contentCardSchema),
  association: z.object({
    title: z.string(),
    paragraphs: z.array(z.string()),
    siteUrl: z.string().url(),
    siteLabel: z.string(),
    pdfUrl: z.string(),
    pdfLabel: z.string(),
  }),
});

export const annuaireSectionSchema = z.object({
  kind: z.literal("annuaire"),
  id: z.string(),
  title: z.string(),
  intro: z.array(z.string()),
  tone: toneSchema,
  centers: z.array(directoryCenterSchema),
});

export const videosSectionSchema = z.object({
  kind: z.literal("videos"),
  id: z.string(),
  title: z.string(),
  intro: z.array(z.string()),
  tone: toneSchema,
  videos: z.array(videoItemSchema),
});

export const resourcesSectionSchema = z.object({
  kind: z.literal("resources"),
  id: z.string(),
  title: z.string(),
  intro: z.array(z.string()),
  tone: toneSchema,
  resources: z.array(resourceLinkSchema),
});

export const sectionSchema = z.discriminatedUnion("kind", [
  definitionSectionSchema,
  statsSectionSchema,
  symptomesSectionSchema,
  diagnosticSectionSchema,
  professionnelsSectionSchema,
  traitementsSectionSchema,
  risquesSectionSchema,
  multidisciplinaireSectionSchema,
  annuaireSectionSchema,
  videosSectionSchema,
  resourcesSectionSchema,
]);

export const articleSchema = z.object({
  date: z.string(),
  title: z.string(),
  subtitle: z.string(),
  heroImage: z.string(),
  heroAlt: z.string(),
  intro: z.object({
    paragraphs: z.array(z.string()),
  }),
  sections: z.array(sectionSchema),
  acknowledgment: z.string().optional(),
});

export type Tone = z.infer<typeof toneSchema>;
export type Block = z.infer<typeof blockSchema>;
export type ArticleData = z.infer<typeof articleSchema>;
export type EndometrioseSection = z.infer<typeof sectionSchema>;
export type DefinitionSection = z.infer<typeof definitionSectionSchema>;
export type StatsSection = z.infer<typeof statsSectionSchema>;
export type SymptomesSection = z.infer<typeof symptomesSectionSchema>;
export type DiagnosticSection = z.infer<typeof diagnosticSectionSchema>;
export type ProfessionnelsSection = z.infer<typeof professionnelsSectionSchema>;
export type TraitementsSection = z.infer<typeof traitementsSectionSchema>;
export type RisquesSection = z.infer<typeof risquesSectionSchema>;
export type MultidisciplinaireSection = z.infer<typeof multidisciplinaireSectionSchema>;
export type AnnuaireSection = z.infer<typeof annuaireSectionSchema>;
export type VideosSection = z.infer<typeof videosSectionSchema>;
export type ResourcesSection = z.infer<typeof resourcesSectionSchema>;

export function parseEndometrioseArticle(data: unknown): ArticleData {
  return articleSchema.parse(data);
}
