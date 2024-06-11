import "@/styles/globals.css";
import { ModalProvider } from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";
import QueryClientProviders from "@/providers/query-client-providers";
import { ThemeProvider } from "@/providers/theme-provider";
import { GeistSans } from "geist/font/sans";
import { ClerkProviderWrapper } from "./clerk-provider";
import { sharedDescription, sharedTitle } from "./shared-metadata";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} antialiased`}>
      <ThemeProvider attribute="class">
        <ClerkProviderWrapper>
          <QueryClientProviders>
            <ToastProvider />
            <ModalProvider />
            <body>{children}</body>
          </QueryClientProviders>
        </ClerkProviderWrapper>
      </ThemeProvider>
    </html>
  );
}

export const metadata = {
  metadataBase: new URL("https://estore.nderic.com"),
  robots: {
    index: true,
    follow: true,
  },
  title: {
    template: `%s — ${sharedTitle}`,
    default: sharedTitle,
  },
  description: sharedDescription,
  openGraph: {
    title: {
      template: `%s — ${sharedTitle}`,
      default: sharedTitle,
    },
    description: sharedDescription,
    alt: sharedTitle,
    type: "website",
    url: "/",
    siteName: sharedTitle,
    locale: "en_IE",
  },
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    site: `@odaltongain`,
    creator: `@odaltongain`,
  },
  other: {
    pinterest: "nopin",
  },
};

export const viewport = {
  themeColor: "white",
  colorScheme: "only light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
