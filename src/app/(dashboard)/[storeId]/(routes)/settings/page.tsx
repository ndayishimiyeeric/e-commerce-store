import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import SettingsForm from "@/components/SettingsForm";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface SettingsPageProps {
  params: { storeId: string };
}
const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) return redirect("/");

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm store={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
