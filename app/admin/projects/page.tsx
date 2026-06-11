import { getProjects } from "@/lib/data";
import { ProjectsManager } from "@/components/admin/projects-manager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects({ onlyPublished: false });
  return <ProjectsManager projects={projects} />;
}
