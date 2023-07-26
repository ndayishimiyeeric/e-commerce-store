import '@/styles/globals.css'
import {ClerkProvider} from "@clerk/nextjs";
import {ModalProvider} from "@/providers/modal-provider";
import {ToastProvider} from "@/providers/toast-provider";
import QueryClientProviders from "@/providers/query-client-providers";

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
