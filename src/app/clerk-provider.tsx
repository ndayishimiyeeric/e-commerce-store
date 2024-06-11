"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export const ClerkProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { resolvedTheme } = useTheme();
  const baseTheme = resolvedTheme === "dark" ? dark : undefined;

  return <ClerkProvider appearance={{ baseTheme }}>{children}</ClerkProvider>;
};
