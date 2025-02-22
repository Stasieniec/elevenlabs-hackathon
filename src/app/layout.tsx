import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Oratoria - Master Social Interactions',
  description: 'Practice and master social interactions with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClerkProvider>
          <main className="min-h-screen bg-[#ECF0F1]">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  )
} 