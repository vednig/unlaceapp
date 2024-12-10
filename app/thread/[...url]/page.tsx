import { Thread } from '@/components/thread'
import { Metadata } from 'next'

async function getData(url: string) {
  const apiUrl = `https://xapi.betaco.tech/x-thread-api?url=${encodeURIComponent(url.replaceAll(',','/'))}`
  const res = await fetch(apiUrl, { next: { revalidate: 3600 } }) // Cache for 1 hour
  console.log(url.replaceAll(',','/'))
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

export async function generateMetadata(props: { params: Promise<{ url: string }> }): Promise<Metadata> {
  const params = await props.params;
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

export default async function Page(props: { params: Promise<{ url: string }> }) {
  const params = await props.params;
  const decodedUrl = decodeURIComponent(params.url)
  const data = await getData(`https://x.com/${decodedUrl}`)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Thread by {data[0].author}</h1>
      <Thread url={`https://x.com/${decodedUrl}`} tweets={data} />
    </main>
  )
}

