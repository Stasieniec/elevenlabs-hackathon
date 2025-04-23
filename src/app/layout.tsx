import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
// No longer need Providers or pathname logic here

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Oratoria',
  description: 'Practice conversations with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider 
      afterSignInUrl="/dashboard" 
      afterSignUpUrl="/dashboard" // Redirect to dashboard after sign up too
    >
      <html lang="en">
        <body className={inter.className} suppressHydrationWarning>
          {children} {/* Content comes from group layouts */}
        </body>
      </html>
    </ClerkProvider>
  );
} 