'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import loading from '../public/machine.png'
import React from 'react'
import EmblaCarousel from './slider'

const OPTIONS = { direction: 'rtl', loop: true }
const SLIDE_COUNT = 10
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

export function ThreadForm() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsProcessing(true)

    if (!url) {
      setError('Please enter a valid URL')
      setIsProcessing(false)
      return
    }

    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(\w+\/status\/\d+)/)
    if (!match) {
      setError('Please enter a valid Twitter/X thread URL')
      setIsProcessing(false)
      return
    }
 fetch(`https://xapi.betaco.tech/x-thread-api?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        setIsProcessing(false)
        if(data.code === 404) {
          setError('Thread not found. Please check the URL and try again.')
          return
        }
        router.push(`/?url=${encodeURIComponent(url)}`)
      })
      .catch((err) => {
        console.error('Error fetching thread data:', err)
        setError('An error occurred while fetching the thread data. Please refresh the page in a while.')
        setIsProcessing
(false)
      })
  }

  return (
    <div className="min-h-screen">
        <div className="text-3xl flex-1 hidden md:flex  font-bold top-0 rounded-2xl   ">
        <h1 className="text-3xl font-extralight m-4">Find or Browse among the top Unlaces</h1>
        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        </div>
      <div className="flex flex-col justify-center p-4  md:p-16  h-full w-full items-center">
        <div className="mb-12 md:hidden">
          <Image
            src="/x-logo.svg"
            alt="X Logo"
            width={40}
            height={40}
            className="md:hidden"
          />
        </div>

        <h1 className="text-3xl font-bold mb-8 text-white ">View thread and take notes</h1>
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

          
          <div className='rounded-lg bg-gray-600 p-2' >
            
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-600 bg-gray-600 text-white focus:outline-none focus:ring-0 focus:ring-blue-500"
              placeholder="Paste the thread URL"
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-[#313131] text-white rounded-full px-6 py-3 font-bold hover:bg-[#3a3a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed "
          >
            {isProcessing ? (<div className='flex animate-pulse'><Image alt='' className='w-6 mx-4 h-6 animate-bounce' height={64} width={64} src={loading}/>Unlacing this one for you ...</div>):'Unlace 🧵'}
          </button>
        </form>
      </div>
    </div>
  )
}

