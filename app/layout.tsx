import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'
import { LenisProvider } from '@/components/lenis-provider'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'Outreach - Cold Emails That Actually Get Replies',
  description: 'Your unfair advantage in the inbox. Generate 3 unique cold email styles — formal, casual, and bold — with AI in under 30 seconds.',
  keywords: ['cold email', 'AI email generator', 'outreach', 'email writer', 'cold outreach tool'],
  openGraph: {
    title: 'Outreach - Cold Emails That Actually Get Replies',
    description: 'Generate 3 unique cold email styles with AI. No account needed.',
    url: 'https://v0-outreach-app.vercel.app',
    siteName: 'Outreach',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Outreach - Cold Emails That Actually Get Replies',
    description: 'Generate 3 unique cold email styles with AI. No account needed.',
  },
  metadataBase: new URL('https://v0-outreach-app.vercel.app'),
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-foreground`}>
        <LenisProvider>
          {children}
          <Toaster position="bottom-right" theme="dark" />
          <Analytics />
        </LenisProvider>
      </body>
    </html>
  )
}
