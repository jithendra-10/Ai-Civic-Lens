import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Public_Sans as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Merriweather as FontHeadline } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/components/theme-provider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontHeadline = FontHeadline({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['300', '400', '700', '900'],
});


export const metadata: Metadata = {
  title: 'CivicLens',
  description: 'AI-powered civic issue reporting',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
        fontHeadline.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            {children}
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
