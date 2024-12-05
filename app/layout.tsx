import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thread Viewer',
  description: 'View X (Twitter) threads in a clean format',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  )
}

