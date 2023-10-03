import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/providers/modal-provider'
import prismadb from '@/lib/prismadb'
import { ToasterProvider } from '@/providers/toast-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Clothing Admin Page',
  description: 'Clothing Admin Page',
}

export default function RootLayout({ 
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider />
      <ModalProvider />
        {children}
      </body>
    </html>
    </ClerkProvider>
  )
}
