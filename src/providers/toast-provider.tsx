"use client"

import React, {useState, useEffect} from "react";
import {Toaster} from "react-hot-toast";

export const ToastProvider = () => {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true)
    }, []);

    if (!isMounted) return null;
    return (
        <Toaster/>
    )
};
