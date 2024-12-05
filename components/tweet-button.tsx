'use client'

import { TwitterIcon } from 'lucide-react'

interface TweetButtonProps {
  url: string
  title: string
}

export function TweetButton({ url, title }: TweetButtonProps) {
  const handleTweet = () => {
    const tweetText = encodeURIComponent(`${title}\n\n${url}`)
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank')
  }

  return (
    <button
      onClick={handleTweet}
      className="bg-[#1D9BF0] text-white rounded-full px-4 py-2 font-bold hover:bg-[#1A8CD8] transition-colors flex items-center space-x-2"
    >
      <TwitterIcon size={18} />
      <span>Tweet this thread</span>
    </button>
  )
}

