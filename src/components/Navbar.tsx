import React from "react";
import {auth, UserButton} from "@clerk/nextjs";
import MainNav from "@/components/MainNav";
import StoreSwitcher from "@/components/StoreSwitcher";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {ModeToggle} from "@/components/ui/ModeToggle";


const Navbar = async () => {
    const {userId} = auth();

    if (!userId) return redirect("/sign-in");

    const stores = await db.store.findMany({
        where: {
            userId,
        }
    })
    return (
        <div className="border-b">
            <div className="container mx-auto antialiased flex h-16 items-center px-4">
                <StoreSwitcher items={stores} />
                <MainNav className="mx-6"/>
                <div className="ml-auto flex items-center space-x-4">
                    <ModeToggle/>
                    <UserButton afterSignOutUrl="/"/>
                </div>
            </div>
        </div>
    )
};

export default Navbar;
