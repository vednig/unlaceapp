'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Thread } from '@/components/thread'
import { ThreadForm } from '@/components/thread-form'
import { TweetButton } from '@/components/tweet-button'
import Link from 'next/link'

import { Tweet } from '@/types/tweet'

async function getData(url: string) {
  const apiUrl = `https://xapi.betaco.tech/x-thread-api?url=${encodeURIComponent(url)}`
  const res = await fetch(apiUrl)
  
  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`)
  }
 
  return res.json()
}

export default function Home() {
  const searchParams = useSearchParams()
  const url = searchParams.get('url')
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (url) {
      setLoading(true)
      setError(null)
      getData(url)
        .then((data) => {
          setTweets(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error fetching thread data:', err)
          setError('An error occurred while fetching the thread data. Please refresh the page in a while.')
          setLoading(false)
        })
    }
  }, [url])

  if (!url) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Suspense>
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Link href="/">
            <h1 className="text-3xl font-bold">Thread Viewer</h1></Link>

            <div className="flex flex-col md:flex-row">
              <Link href="/my-comments" className="text-blue-400 hover:underline px-4 py-4">
                My Comments
              </Link>
              <Link href="/saved-threads" className="text-blue-400 hover:underline px-4 py-4">
                Saved Threads
              </Link>
            </div>
          </div>
          <ThreadForm />
        </main>
        </Suspense>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Suspense>
      <main className="container mx-auto  py-8 md:px-4">
        <div className="flex justify-between items-center mb-8 fixed top-0 right-0 w-full backdrop-blur-lg bg-transparent px-4 py-4">
        <Link href="/">
          <h1 className="text-3xl font-bold text-white">📖Unlaced Thread Reader</h1>
          </Link>
          <div className="space-x-4">
            <Link href="/my-comments" className="text-blue-400 hover:underline">
              My Comments
            </Link>
            <Link href="/saved-threads" className="text-blue-400 hover:underline">
              Saved Threads
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="text-white text-center">Loading thread data...<br/><span className='text-gray-400 animate-pulse'> Might take some time</span>{
           
          }</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : tweets.length > 0 ? (
          <div className='mt-6'>
            <Thread tweets={tweets} url={url} />
            <div className="mt-8 items-center justify-center flex">
              <TweetButton url={url} title={`${tweets[0].author}: ${tweets[0].text.slice(0, 50)}...`} />
            </div>
          </div>
        ) : null}
      </main>
      </Suspense>
    </div>
  )
}

