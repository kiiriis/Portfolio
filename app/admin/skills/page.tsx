import { getSkillGroups } from "@/lib/data";
import { SkillsEditor } from "@/components/admin/skills-editor";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const groups = await getSkillGroups();
  return <SkillsEditor groups={groups} />;
}
