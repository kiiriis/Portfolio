import { getProfile } from "@/lib/data";
import { ProfileForm } from "@/components/admin/profile-form";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getProfile();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Profile</h1>
        <p className="text-muted-foreground">
          Your name, headline, story, and contact links.
        </p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
