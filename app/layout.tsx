import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from 'react'

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
        <Suspense>
        {children}
        </Suspense>
      </body>
      <Analytics/>
      <script 
 defer 
 data-site-id="unlace.app" 
 src="https://assets.onedollarstats.com/tracker.js"> 
</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9266977335148174"
     crossOrigin="anonymous"></script>
    </html>
  )
}

