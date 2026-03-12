import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'ColdMailCrafter - Cold Emails That Actually Get Replies',
  description: 'Your unfair advantage in the inbox. Generate 3 unique cold email styles with AI.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-foreground`}>
        {children}
        <Toaster position="bottom-right" theme="dark" />
        <Analytics />
      </body>
    </html>
  )
}
