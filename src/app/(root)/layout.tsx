import {auth} from "@clerk/nextjs";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";

export default async function SetupLayout(
    {children}: {children: React.ReactNode}
) {
    const {userId} = auth();
    if (!userId) {
        return redirect("/sign-in");
    }

    const store = await db.store.findFirst({
        where: {
            userId,
        },
    })

    if (store) {
        return redirect(`/${store.id}`)
    }

    return (
        <>
            {children}
        </>
    )
}