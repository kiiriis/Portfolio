import { prisma } from "@/lib/db";
import { FavoritesManager } from "@/components/admin/favorites-manager";

export const dynamic = "force-dynamic";

export default async function AdminFavoritesPage() {
  const favorites = await prisma.favorite.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return <FavoritesManager favorites={favorites} />;
}
