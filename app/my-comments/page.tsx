'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

interface Comment {
  url: string
  tweetId: string
  text: string
}

export default function MyComments() {
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = () => {
    const storedComments = localStorage.getItem('threadComments')
    if (storedComments) {
      const parsedComments = JSON.parse(storedComments)
      const commentArray: Comment[] = []
      
      Object.entries(parsedComments).forEach(([threadUrl, threadComments]) => {
        Object.entries(threadComments as Record<string, string>).forEach(([tweetId, commentText]) => {
          commentArray.push({
            url: threadUrl,
            tweetId,
            text: commentText
          })
        })
      })
      
      setComments(commentArray)
    }
  }

  const handleDeleteComment = (url: string, tweetId: string) => {
    const storedComments = JSON.parse(localStorage.getItem('threadComments') || '{}')
    if (storedComments[url]) {
      delete storedComments[url][tweetId]
      if (Object.keys(storedComments[url]).length === 0) {
        delete storedComments[url]
      }
      localStorage.setItem('threadComments', JSON.stringify(storedComments))
      loadComments()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Comments</h1>
      {comments.length === 0 ? (
        <p>You haven't made any comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment, index) => {
            const [quotedText, commentText] = comment.text.split('\n\nComment:')
            return (
              <li key={index} className="bg-gray-800 p-4 rounded-lg relative group">
                <Link href={`/?url=${encodeURIComponent(comment.url)}`} className="text-blue-400 hover:underline">
                  {comment.url}
                </Link>
                <blockquote className="pl-2 border-l-4 border-gray-500 italic text-gray-400 my-2">
                  {quotedText}
                </blockquote>
                <p className="mt-2 text-gray-300">{commentText}</p>
                <button
                  onClick={() => handleDeleteComment(comment.url, comment.tweetId)}
                  className="absolute top-2 right-2 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete comment"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

