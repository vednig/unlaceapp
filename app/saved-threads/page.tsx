'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

interface SavedThread {
  url: string
  title: string
}

export default function SavedThreads() {
  const [savedThreads, setSavedThreads] = useState<SavedThread[]>([])

  useEffect(() => {
    loadSavedThreads()
  }, [])

  const loadSavedThreads = () => {
    const storedThreads = localStorage.getItem('savedThreads')
    if (storedThreads) {
      setSavedThreads(JSON.parse(storedThreads))
    }
  }

  const handleUnsaveThread = (url: string) => {
    const updatedThreads = savedThreads.filter(thread => thread.url !== url)
    localStorage.setItem('savedThreads', JSON.stringify(updatedThreads))
    setSavedThreads(updatedThreads)
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Saved Threads</h1>
      {savedThreads.length === 0 ? (
        <p>You haven't saved any threads yet.</p>
      ) : (
        <ul className="space-y-4">
          {savedThreads.map((thread, index) => (
            <li key={index} className="bg-gray-800 p-4 rounded-lg relative group">
              <Link href={`/?url=${encodeURIComponent(thread.url)}`} className="text-blue-400 hover:underline">
                {thread.title}
              </Link>
              <button
                onClick={() => handleUnsaveThread(thread.url)}
                className="absolute top-2 right-2 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Unsave thread"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

