import { prisma } from "@/lib/db";
import type {
  Profile,
  Experience,
  ExperienceBullet,
  Education,
  Project,
  Skill,
} from "@prisma/client";

export type ExperienceWithBullets = Experience & {
  bullets: ExperienceBullet[];
};

export type SkillGroup = {
  category: string;
  skills: Skill[];
};

export async function getProfile(): Promise<Profile | null> {
  return prisma.profile.findUnique({ where: { id: "singleton" } });
}

export async function getExperiences(): Promise<ExperienceWithBullets[]> {
  return prisma.experience.findMany({
    orderBy: { sortOrder: "asc" },
    include: { bullets: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getEducation(): Promise<Education[]> {
  return prisma.education.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getProjects(
  opts: { onlyPublished?: boolean } = { onlyPublished: true }
): Promise<Project[]> {
  return prisma.project.findMany({
    where: opts.onlyPublished ? { published: true } : undefined,
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return prisma.project.findUnique({ where: { slug } });
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  const order = new Map<string, number>();
  const groups: SkillGroup[] = [];
  for (const skill of skills) {
    if (!order.has(skill.category)) {
      order.set(skill.category, groups.length);
      groups.push({ category: skill.category, skills: [] });
    }
    groups[order.get(skill.category)!].skills.push(skill);
  }
  return groups;
}
