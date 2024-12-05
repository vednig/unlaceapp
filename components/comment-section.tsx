interface CommentSectionProps {
  tweetId: string
  comment: string
  onCommentChange: (comment: string) => void
}

export function CommentSection({ tweetId, comment, onCommentChange }: CommentSectionProps) {
  return (
    <div className="mt-2">
      <textarea
        id={`comment-${tweetId}`}
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Add a comment..."
        className="w-full px-3 py-2 text-sm text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={2}
      />
    </div>
  )
}

