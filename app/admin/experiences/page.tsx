import { getExperiences } from "@/lib/data";
import { ExperiencesManager } from "@/components/admin/experiences-manager";

export const dynamic = "force-dynamic";

export default async function AdminExperiencesPage() {
  const experiences = await getExperiences();
  return <ExperiencesManager experiences={experiences} />;
}
