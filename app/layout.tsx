import React from "react"
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import QueryProvider from '@/components/query-provider'
import { AuthProvider } from '@/lib/useAuth'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'Kisibo Jonathan | Full-Stack Developer',
  description: 'Full-stack developer specializing in Web Development, Mobile Apps, and System/Software Development. Available for freelance work and new opportunities.',
  generator: 'v0.app',
  keywords: ['developer', 'web development', 'mobile apps', 'software development', 'freelance', 'portfolio'],
  authors: [{ name: 'Kisibo Jonathan' }],
  icons: {
    icon: [
      {
        url: 'https://images.vexels.com/media/users/3/224169/isolated/lists/dbfe1f493ad01117fa4ec5ba10150e4d-computer-programming-logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: 'https://images.vexels.com/media/users/3/224169/isolated/lists/dbfe1f493ad01117fa4ec5ba10150e4d-computer-programming-logo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: 'https://images.vexels.com/media/users/3/224169/isolated/lists/dbfe1f493ad01117fa4ec5ba10150e4d-computer-programming-logo.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <Navigation />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
