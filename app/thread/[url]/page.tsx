import { Thread } from '@/components/thread'
import { Metadata } from 'next'

async function getData(url: string) {
  const apiUrl = `/api/thread?url=${encodeURIComponent(url)}`
  const res = await fetch(apiUrl, { next: { revalidate: 3600 } }) // Cache for 1 hour
  
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

export async function generateMetadata({ params }: { params: { url: string } }): Promise<Metadata> {
  const decodedUrl = decodeURIComponent(params.url)
  const data = await getData(`https://x.com/${decodedUrl}`)
  const firstTweet = data[0]

  return {
    title: `Thread by ${firstTweet.author}`,
    description: firstTweet.text.slice(0, 160),
    openGraph: {
      title: `Thread by ${firstTweet.author}`,
      description: firstTweet.text.slice(0, 160),
      images: [firstTweet.media[1] || firstTweet.media[0]],
    },
  }
}

export default async function Page({ params }: { params: { url: string } }) {
  const decodedUrl = decodeURIComponent(params.url)
  const data = await getData(`https://x.com/${decodedUrl}`)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Thread by {data[0].author}</h1>
      <Thread url={`https://x.com/${decodedUrl}`} tweets={data} />
    </main>
  )
}

