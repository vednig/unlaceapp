'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { VideoPlayer } from './video-player'
import { Tweet } from '@/types/tweet'
import { CommentModal } from './comment-modal'
import 'video.js/dist/video-js.css'

function hasEmojiInPath(str: string): boolean {
  return str.toLowerCase().includes('emoji')
}

function replaceLinksWithTcoLinks(text: string, links: string[]): JSX.Element[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      const linkIndex = links.findIndex(link => link.includes(part))
      if (linkIndex !== -1) {
        return (
          <a
            key={index}
            href={links[linkIndex]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1D9BF0] hover:underline"
          >
            {`https://t.co/${linkIndex + 1}`}
          </a>
        )
      }
    }
    return <span key={index}>{part}</span>
  })
}

export function Thread({ tweets }: { tweets: Tweet[] }) {
  const [comments, setComments] = useState<Record<string, string>>({})
  const [selectedText, setSelectedText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTweetId, setCurrentTweetId] = useState<string | null>(null)

  useEffect(() => {
    const storedComments = localStorage.getItem('threadComments')
    if (storedComments) {
      setComments(JSON.parse(storedComments))
    }
  }, [])

  const handleCommentChange = (tweetId: string, comment: string) => {
    const newComments = { ...comments, [tweetId]: comment }
    setComments(newComments)
    localStorage.setItem('threadComments', JSON.stringify(newComments))
  }

  const handleTextSelection = (event: MouseEvent, tweetId: string) => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString())
      setCurrentTweetId(tweetId)
      setIsModalOpen(true)
    }
  }

  if (tweets.length === 0) {
    return <div className="text-white text-center">No tweets to display.</div>
  }

  const firstTweet = tweets[0]

  return (
    <article className="max-w-2xl mx-auto bg-black text-white">
      <header className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <Image
            src={firstTweet.media[0]}
            alt={firstTweet.author}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h2 className="font-bold text-xl">{firstTweet.author}</h2>
            <p className="text-gray-500">@{firstTweet.author.toLowerCase().replace(/\s/g, '')}</p>
          </div>
        </div>
      </header>
      <div className="p-4 space-y-4">
        {tweets.map((tweet, tweetIndex) => (
          <div 
            key={tweetIndex} 
            className="space-y-3"
            onMouseUp={(e) => handleTextSelection(e.nativeEvent, tweet.tweet_id)}
          >
            <p className="whitespace-pre-line">
              {replaceLinksWithTcoLinks(tweet.text, tweet.links)}
            </p>
            <div className="flex flex-wrap items-start">
              {Array.isArray(tweet.media) && tweet.media.slice(1).map((mediaUrl, mediaIndex) => {
                if (typeof mediaUrl !== 'string') {
                  console.error('Invalid media URL:', mediaUrl);
                  return null;
                }

                if (mediaUrl.endsWith('.m3u8')) {
                  const videoSources = tweet.media.filter(url => 
                    typeof url === 'string' && (url.endsWith('.m3u8') || url.endsWith('.mp4'))
                  ) as string[]
                  const poster = tweet.media.find(url => 
                    typeof url === 'string' && url.includes('video_thumb')
                  )
                  return (
                    <div key={`${tweetIndex}-${mediaIndex}`} className="w-full mb-2">
                      <VideoPlayer
                        sources={videoSources}
                        poster={poster}
                      />
                    </div>
                  )
                }
                if (mediaUrl.endsWith('.jpg') || mediaUrl.endsWith('.png')) {
                  return (
                    <div key={`${tweetIndex}-${mediaIndex}`} className={`${hasEmojiInPath(mediaUrl) ? 'inline-block mr-2' : 'w-full'}`}>
                      <Image
                        src={mediaUrl}
                        alt={`Media ${mediaIndex + 1}`}
                        width={hasEmojiInPath(mediaUrl) ? 26 : 500}
                        height={hasEmojiInPath(mediaUrl) ? 26 : 300}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )
                }
                return null
              })}
            </div>
            {comments[tweet.tweet_id] && (
              <div className="mt-2 p-2 bg-gray-800 rounded-md">
                <p className="text-sm text-gray-300">Comment: {comments[tweet.tweet_id]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <footer className="p-4 border-t border-gray-800 text-gray-500 text-sm">
        <p>{new Date(firstTweet.timestamp).toLocaleString()}</p>
      </footer>
      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(comment) => {
          if (currentTweetId) {
            handleCommentChange(currentTweetId, `${selectedText}\n\nComment: ${comment}`)
          }
        }}
        initialComment={currentTweetId ? comments[currentTweetId] || '' : ''}
      />
    </article>
  )
}

