import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider, SignedIn, SignedOut, SignIn } from '@clerk/nextjs';
import './globals.css';
import UserSync from '@/components/UserSync';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CareerCompass - AI-Powered Career Guidance',
  description: 'Get personalized career recommendations and upskilling paths',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.variable}>
          <UserSync/>
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
