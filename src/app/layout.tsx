import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";
import QueryClientProviders from "@/providers/query-client-providers";
import { ThemeProvider } from "@/providers/theme-provider";
import { GeistSans } from "geist/font/sans";

export const metadata = {
  title: "Ecommerce | Admin",
  description: "Ecommerce store.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} antialiased`}>
      <ClerkProvider>
        <QueryClientProviders>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ToastProvider />
            <ModalProvider />
            <body>{children}</body>
          </ThemeProvider>
        </QueryClientProviders>
      </ClerkProvider>
    </html>
  );
}
