"use client"

import React,{useState, useEffect} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


const QueryClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
      setIsMounted(true)
    }, []);

  return isMounted ? (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  ) : (
    <>{children}</>
  );
};

export default QueryClientProviders;