import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { SupabaseProvider } from './supabase-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Oratoria - Master Social Interactions',
  description: 'Practice and master social interactions with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
        </body>
      </html>
    </ClerkProvider>
  );
} 