import './globals.css'
import './css/base.css'
import './css/sandbox.css'
import './css/emble.css'

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
      {/* <div dangerouslySetInnerHTML={{__html:`<script 
 defer 
 data-site-id="unlace.app" 
 src="https://assets.onedollarstats.com/tracker.js"> 
</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9266977335148174"
     crossOrigin="anonymous"></script>`}}></div> */}
      <body className="bg-black text-white">
        <Suspense>
        {children}
        </Suspense>
      </body>
      <Analytics/>
      
    </html>
  )
}

