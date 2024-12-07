'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
// import { VideoPlayer } from './video-player'
import { Tweet } from '@/types/tweet'
import { CommentModal } from './comment-modal'
import { Edit2 } from 'lucide-react'
import 'video.js/dist/video-js.css'

// function hasEmojiInPath(str: string): boolean {
//   return str.toLowerCase().includes('emoji')
// }

function replaceLinksWithTcoLinks(text: string, links: string[]): JSX.Element[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  
  let linkcount=0
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      const linkIndex = linkcount
      linkcount+=1
        return (
          <a
            key={index}
            href={links[linkIndex]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1D9BF0] hover:underline"
          >
            {`${part}`}
          </a>
        )
    }
    return <span key={index}>{part}</span>
  })
}

interface ThreadProps {
  tweets: Tweet[]
  url: string
}

export function Thread({ tweets, url }: ThreadProps) {
  const [comments, setComments] = useState<Record<string, string>>({})
  const [selectedText, setSelectedText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTweetId, setCurrentTweetId] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)

  useEffect(() => {
    const storedComments = localStorage.getItem('threadComments')
    if (storedComments) {
      const parsedComments = JSON.parse(storedComments)
      const threadComments = parsedComments[url] || {}
      setComments(threadComments)
    }

    const savedThreads = JSON.parse(localStorage.getItem('savedThreads') || '[]')
    setIsSaved(savedThreads.some((thread: { url: string }) => thread.url === url))
  }, [url])

  const handleCommentChange = (tweetId: string, comment: string) => {
    const newComments = { ...comments, [tweetId]: comment }
    setComments(newComments)
    
    const storedComments = JSON.parse(localStorage.getItem('threadComments') || '{}')
    storedComments[url] = newComments
    localStorage.setItem('threadComments', JSON.stringify(storedComments))
  }

  const handleTextSelection = (event: MouseEvent, tweetId: string) => {
    if (comments[tweetId]) return // Prevent commenting on tweets with existing comments

    const selection = window.getSelection()
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString())
      setCurrentTweetId(tweetId)
      setIsModalOpen(true)
    }
  }

  const handleEditComment = (tweetId: string) => {
    setEditingCommentId(tweetId)
    setCurrentTweetId(tweetId)
    setIsModalOpen(true)
  }

  const handleSaveThread = () => {
    const savedThreads = JSON.parse(localStorage.getItem('savedThreads') || '[]')
    if (!isSaved) {
      savedThreads.push({ url, title: tweets[0].text.slice(0, 50) + '...' })
      localStorage.setItem('savedThreads', JSON.stringify(savedThreads))
      setIsSaved(true)
    } else {
      const updatedThreads = savedThreads.filter((thread: { url: string }) => thread.url !== url)
      localStorage.setItem('savedThreads', JSON.stringify(updatedThreads))
      setIsSaved(false)
    }
  }

  if (tweets.length === 0) {
    return <div className="text-white text-center">No tweets to display.</div>
  }

  const firstTweet = tweets[0]

  return (
    <article className="max-w-2xl mx-auto bg-black text-white">
      <header className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <a 
            target='no_follow'
            href={"https://x.com/"+firstTweet.author.toLowerCase().replace(/\s/g, '')}
            >
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
            </a>
          </div>
          <button
            onClick={handleSaveThread}
            className={`px-4 py-2 rounded-full ${
              isSaved ? 'bg-gray-600 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            {isSaved ? 'Unsave Thread' : 'Save Thread'}
          </button>
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
              { tweet.media.map((mediaUrl, mediaIndex) => {
                let keycount=0
                if (typeof mediaUrl !== 'string') {
                  console.error('Invalid media URL:', mediaUrl);
                  return null;
                }

                // if (mediaUrl.endsWith('.m3u8')) {
                //   const videoSources = tweet.media.filter(url => 
                //     typeof url === 'string' && (url.endsWith('.m3u8') || url.endsWith('.mp4'))
                //   ) as string[]
                //   const poster = tweet.media.find(url => 
                //     typeof url === 'string' && url.includes('video_thumb')
                //   )
                //   return (
                //     <div key={`${tweetIndex}-${mediaIndex}`} className="w-full mb-2">
                //       <VideoPlayer
                //         sources={videoSources}
                //         poster={poster}
                //       />
                //     </div>
                //   )
                // }
                if (mediaUrl.indexOf('media')!==-1 && mediaUrl.indexOf('profile_images')==-1) {
                  keycount+=1
                  return (
                    <div key={`${keycount}`} >
                      <img
                        src={mediaUrl}
                        alt={`Media ${mediaIndex + 1}`}
                      />
                    </div>
                  )
                }
                return null
              })}
            </div>
            {tweet.links && tweet.links.length > 0 && (
              <div className="space-y-2">
                {tweet.links.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1D9BF0] hover:underline block"
                  >
                    {`${link}`}
                  </a>
                ))}
              </div>
            )}
            {comments[tweet.tweet_id] && (
              <div className="mt-2 p-2 bg-gray-800 rounded-md relative group">
                <blockquote className="pl-2 border-l-4 border-gray-500 italic text-gray-400 mb-2">
                  {comments[tweet.tweet_id].split('\n\nComment:')[0]}
                </blockquote>
                <p className="text-sm text-gray-300">
                  {comments[tweet.tweet_id].split('\n\nComment:')[1]}
                </p>
                <button
                  onClick={() => handleEditComment(tweet.tweet_id)}
                  className="absolute top-2 right-2 p-1 bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 size={16} />
                </button>
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
        onClose={() => {
          setIsModalOpen(false)
          setEditingCommentId(null)
        }}
        onSave={(comment) => {
          if (currentTweetId) {
            const existingComment = comments[currentTweetId]
            const newComment = editingCommentId
              ? `${existingComment.split('\n\nComment:')[0]}\n\nComment: ${comment}`
              : `${selectedText}\n\nComment: ${comment}`
            handleCommentChange(currentTweetId, newComment)
          }
        }}
        initialComment={editingCommentId ? comments[editingCommentId]?.split('\n\nComment:')[1] || '' : ''}
        isEditing={!!editingCommentId}
      />
    </article>
  )
}

