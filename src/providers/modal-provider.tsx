"use client"

import React, {useState, useEffect} from "react";
import {StoreModal} from "@/components/modals/store-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true)
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <StoreModal/>
        </>
    )
}