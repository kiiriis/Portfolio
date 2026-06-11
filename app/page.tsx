import {
  getProfile,
  getExperiences,
  getEducation,
  getProjects,
  getSkillGroups,
} from "@/lib/data";
import { Nav } from "@/components/public/nav";
import { Hero } from "@/components/public/hero";
import { About } from "@/components/public/about";
import { ExperienceTimeline } from "@/components/public/experience-timeline";
import { ResearchHighlight } from "@/components/public/research-highlight";
import { ProjectsGrid } from "@/components/public/projects-grid";
import { SectionHeading } from "@/components/public/section-heading";
import { Education } from "@/components/public/education";
import { SkillsSection } from "@/components/public/skills-section";
import { Contact } from "@/components/public/contact";
import { Footer } from "@/components/public/footer";

// Always read the latest content so admin edits reflect immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, experiences, education, allProjects, skillGroups] =
    await Promise.all([
      getProfile(),
      getExperiences(),
      getEducation(),
      getProjects(),
      getSkillGroups(),
    ]);

  if (!profile) {
    return (
      <main className="container flex min-h-screen flex-col items-center justify-center text-center">
        <h1 className="font-display text-2xl font-semibold">
          Portfolio not set up yet
        </h1>
        <p className="mt-2 text-muted-foreground">
          Run <code className="font-mono text-primary">npm run seed</code> or add
          content from the{" "}
          <a href="/admin" className="text-primary underline">
            admin dashboard
          </a>
          .
        </p>
      </main>
    );
  }

  const research = allProjects.filter((p) => p.category === "Research");
  const projects = allProjects.filter((p) => p.category !== "Research");

  return (
    <>
      <Nav
        name={profile.name}
        resumeUrl={profile.resumeUrl}
        githubUrl={profile.githubUrl}
      />
      <main>
        <Hero
          name={profile.name}
          headline={profile.headline}
          heroTagline={profile.heroTagline}
          location={profile.location}
          email={profile.email}
          githubUrl={profile.githubUrl}
          linkedinUrl={profile.linkedinUrl}
        />

        <About aboutMd={profile.aboutMd} />

        <ExperienceTimeline experiences={experiences} />

        {research.map((p) => (
          <ResearchHighlight key={p.id} project={p} />
        ))}

        <section id="projects" className="container scroll-mt-20 py-28">
          <SectionHeading
            no="04"
            eyebrow="Projects"
            title="Things I've built"
            description="A mix of production systems, research, and side projects. Click any card for details and demos."
          />
          {projects.length > 0 ? (
            <ProjectsGrid projects={projects} />
          ) : (
            <p className="text-muted-foreground">No projects yet.</p>
          )}
        </section>

        {education.length > 0 && (
          <section id="education" className="container scroll-mt-20 py-12">
            <SectionHeading no="05" eyebrow="Education" title="Where I studied" />
            <Education education={education} />
          </section>
        )}

        <SkillsSection groups={skillGroups} />

        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
