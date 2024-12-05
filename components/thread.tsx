'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
// import { VideoPlayer } from './video-player'
import { Tweet } from '@/types/tweet'
import { CommentModal } from './comment-modal'

// function hasEmoji(str: string): boolean {
//   // const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u
//   // return emojiRegex.test(str)
//   return str.toLowerCase().includes('emoji')

// }

function replaceLinks(text: string, links: string[]): JSX.Element[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  let linkcount=0
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      const linkIndex = linkcount
      linkcount+=1
        return (
          <a
            key={linkcount}
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
            <h1 className="font-bold text-xl">{firstTweet.author}</h1>
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
              {replaceLinks(tweet.text,tweet.links)}
              {/* {tweet.media.map((mediaUrl, mediaIndex) => {
                if ( mediaUrl.indexOf('emoji')!==-1  ) {
                return (
                    <img
                      src={mediaUrl}
                      key={`${tweetIndex}-${mediaIndex}`}
                      alt={`Media ${mediaIndex + 1}`}
                    
                      className="w-4"
                    />
                )}
              })
              } */}
            </p>
            <div className="flex flex-wrap items-start">
              {tweet.media.map((mediaUrl, mediaIndex) => {
                let keycount=0
                if (typeof mediaUrl !== 'string') {
                  console.error('Invalid media URL:', mediaUrl);
                //   if(Array.isArray(mediaUrl)){
                //   mediaUrl.map((index,vidlink)=>{ 
                //     console.error(index)
                //     if (vidlink.indexOf('.m3u8')!==-1) {
                //       return (
                //         <>
                //         Video:
                //         <div key={`${tweetIndex}-${mediaIndex}`} className={hasEmoji(mediaUrl) ? 'inline-block mr-2' : 'w-full mb-2'}>
                //           <VideoPlayer
                //             src={mediaUrl}
                //             poster={typeof tweet.media[mediaIndex + 1] === 'string' ? tweet.media[mediaIndex + 1] : undefined}
                //           />
                //         </div>
                //         </>
                //       )
                //     }
                    
                // })
                //   }
                
                }

                // if (mediaUrl.indexOf('.m3u8')!==-1){
                  
                //   return (
                    
                //     <div key={`${tweetIndex}-${mediaIndex}`} className={hasEmoji(mediaUrl) ? 'inline-block mr-2' : 'w-full mb-2'}>
                //       {/* <VideoPlayer src={mediaUrl} /> */}
                //     </div>
                    
                //   )
                // }
              
                if ( mediaUrl.indexOf('media')!==-1) {
                  keycount+=1
                  return (
                    <div key={`${keycount}`}>
                      <img
                        src={mediaUrl}
                        alt={`Media ${mediaIndex + 1}`}
                        
                      />
                    </div>
                  )}}
                
              )}
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

