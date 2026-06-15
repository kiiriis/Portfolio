import { z } from "zod";

/** "" or null → null; otherwise the trimmed string. */
const optionalStr = z.preprocess(
  (v) => (v === "" || v == null ? null : v),
  z.string().nullable()
);

/** "" or null → null; otherwise must be a valid URL. */
const optionalUrl = z.preprocess(
  (v) => (v === "" || v == null ? null : v),
  z.string().url().nullable()
);

export const profileSchema = z.object({
  name: z.string().min(1),
  headline: z.string().min(1),
  heroTagline: z.string().min(1),
  aboutMd: z.string().min(1),
  location: optionalStr,
  email: z.string().email(),
  githubUrl: z.string().url(),
  linkedinUrl: z.string().url(),
  resumeUrl: optionalStr,
  photos: z.array(z.string()).default([]),
});

export const experienceSchema = z.object({
  role: z.string().min(1),
  organization: z.string().min(1),
  location: optionalStr,
  startDate: z.string().min(1),
  endDate: optionalStr,
  summary: optionalStr,
  techTags: z.array(z.string().min(1)).default([]),
  sortOrder: z.coerce.number().int().default(0),
  bullets: z.array(z.string().min(1)).default([]),
});

export const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  location: optionalStr,
  gpa: optionalStr,
  startDate: optionalStr,
  endDate: optionalStr,
  details: optionalStr,
  sortOrder: z.coerce.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  tagline: z.string().min(1),
  description: z.string().min(1),
  techTags: z.array(z.string().min(1)).default([]),
  category: optionalStr,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  demoVideoUrl: optionalUrl,
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const skillSchema = z.object({
  category: z.string().min(1),
  name: z.string().min(1),
  sortOrder: z.coerce.number().int().default(0),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
