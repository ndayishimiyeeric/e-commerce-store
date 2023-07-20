"use client"

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const QueryClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
};

export default QueryClientProviders;