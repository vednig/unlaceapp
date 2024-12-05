import { Thread } from '@/components/thread'
import { ThreadForm } from '@/components/thread-form'
import { Metadata } from 'next'
import { TweetButton } from '@/components/tweet-button'
import { ErrorBoundary } from '@/components/error-boundary'
import Link from 'next/link'

interface Props {
  searchParams: { url?: string }
}

async function getData(url: string) {
  const apiUrl = `https://xapi.betaco.tech/x-thread-api?url=${encodeURIComponent(url)}`
  const res = await fetch(apiUrl, { next: { revalidate: 3600 } }) // Cache for 1 hour
  
  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`)
  }
 
  return res.json()
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  if (!searchParams.url) {
    return {
      title: 'Thread Viewer',
      description: 'View X (Twitter) threads in a clean format'
    }
  }

  try {
    const data = await getData(searchParams.url)
    const firstTweet = data[0]
    const title = `${firstTweet.author}: ${firstTweet.text.slice(0, 50)}...`

    return {
      title,
      description: firstTweet.text.slice(0, 160),
      openGraph: {
        title,
        description: firstTweet.text.slice(0, 160),
        images: [firstTweet.media[1] || firstTweet.media[0]],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Thread Viewer - Error',
      description: 'An error occurred while fetching the thread data.',
    }
  }
}

export default async function Page({ searchParams }: Props) {
  if (!searchParams.url) {
    return <ThreadForm />
  }

  try {
    const data = await getData(searchParams.url)
    const pageTitle = `${data[0].author}: ${data[0].text.slice(0, 50)}...`

    return (
      <div className="min-h-screen bg-black">
        <main className="container mx-auto px-4 py-8">
          <ErrorBoundary fallback={<ErrorMessage />}>
            <h1 className="text-2xl font-bold mb-4 text-white">{pageTitle}</h1>
            <Thread tweets={data} />
            <div className="mt-8">
              <TweetButton url={searchParams.url} title={pageTitle} />
            </div>
          </ErrorBoundary>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error fetching thread data:', error)
    return <ErrorMessage />
  }
}

function ErrorMessage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>An error occurred while fetching the thread data. Please try again later.</p>
        <Link href="/" className="text-blue-400 hover:underline mt-4 inline-block">Go back to home</Link>
      </div>
    </div>
  )
}

