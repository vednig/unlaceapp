import { useState, useEffect } from 'react'

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (comment: string) => void
  initialComment: string
  isEditing?: boolean
  selection?: string
}

export function CommentModal({ isOpen, onClose, onSave, initialComment, isEditing,selection }: CommentModalProps) {
  const [comment, setComment] = useState(initialComment)

  useEffect(() => {
    setComment(initialComment)
  }, [initialComment])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-white">{isEditing ? 'Edit Note' : 'Add Note'}</h2>
        <h4 className="text-sm text-gray-400 mb-4"><span className='font-bold text-white'>Context:</span>{selection?.toString()}</h4>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 text-sm text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          rows={4}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(comment)
              onClose()
            }}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

