import { getEducation } from "@/lib/data";
import { EducationManager } from "@/components/admin/education-manager";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const education = await getEducation();
  return <EducationManager education={education} />;
}
