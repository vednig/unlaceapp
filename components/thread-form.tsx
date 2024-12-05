'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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

    router.push(`/?url=${encodeURIComponent(url)}`)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-black">
        <Image
          src="/x-logo.svg"
          alt="X Logo"
          width={320}
          height={320}
          className="text-white"
        />
      </div>
      <div className="flex flex-col justify-center p-8 md:p-16">
        <div className="mb-12">
          <Image
            src="/x-logo.svg"
            alt="X Logo"
            width={40}
            height={40}
            className="md:hidden"
          />
        </div>
        <h1 className="text-3xl font-bold mb-8 text-white">View thread</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste the thread URL"
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-[#1D9BF0] text-white rounded-full px-6 py-3 font-bold hover:bg-[#1A8CD8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'View Thread'}
          </button>
        </form>
      </div>
    </div>
  )
}

