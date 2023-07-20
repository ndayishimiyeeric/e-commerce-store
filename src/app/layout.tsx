import '@/styles/globals.css'
import {Inter} from 'next/font/google'
import {ClerkProvider} from "@clerk/nextjs";
import {ModalProvider} from "@/providers/modal-provider";
import {ToastProvider} from "@/providers/toast-provider";
import QueryClientProviders from "@/providers/query-client-providers";

const inter = Inter({subsets: ['latin']})

export const metadata = {
  title: 'Ecommerce | Admin',
  description: 'Ecommerce store.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <QueryClientProviders>
          <ToastProvider/>
          <ModalProvider/>
          <body className={inter.className}>{children}</body>
        </QueryClientProviders>
      </html>
    </ClerkProvider>
  )
}
