import React from 'react';
import {auth} from "@clerk/nextjs";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout(
    {
        children,
        params
    }: {children: React.ReactNode, params: {storeId: string}}
) {
    const {userId} = auth();

    if (!userId) {
        return redirect("/sign-in");
    }

    const store = await db.store.findFirst({
        where: {
            id: params.storeId,
            userId,
        },
    })

    if (!store) {
        return redirect("/")
    }

    return (
        <>
            <Navbar/>
            {children}
        </>

    )
}