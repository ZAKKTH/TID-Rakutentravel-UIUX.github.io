import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rakuten Travel AI',
  description: 'AI-powered semantic hotel search. Find your perfect stay with natural language queries.',
  keywords: ['travel', 'hotel', 'search', 'AI', 'Japan', 'Rakuten'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#b71c1c',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="bg-background">
      <body className="text-foreground">
        {children}
      </body>
    </html>
  )
}
