import '@/styles/globals.css'
import {Inter} from 'next/font/google'
import {ClerkProvider} from "@clerk/nextjs";
import {ModalProvider} from "@/providers/modal-provider";
import {ToastProvider} from "@/providers/toast-provider";
import QueryClientProviders from "@/providers/query-client-providers";
import {cn} from "@/lib/utils";

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
      <html lang='en' className='antialiased'>
        <ClerkProvider>
          <QueryClientProviders>
            <ToastProvider/>
            <ModalProvider/>
            <body>{children}</body>
          </QueryClientProviders>
        </ClerkProvider>
      </html>
  )
}
