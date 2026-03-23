
import { cn } from '@/lib/utils' 
import { useIsThreadActive } from '@liveblocks/react-lexical' 
import { Composer, Thread } from '@liveblocks/react-ui' 
import { useThreads } from '@liveblocks/react/suspense'
import React from 'react' 


const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {

  const isActive = useIsThreadActive(thread.id)

  return (
    // Thread
    <Thread
      thread={thread}
      data-state={isActive ? 'active' : null}
      className={cn(
        'comment-thread border p-4 rounded-lg mb-4', 
        isActive && '!border-blue-500 shadow-md', 
        thread.resolved && 'opacity-40',
      )}
    >

      {thread.resolved && (
        <span className='ml-2 text-sm text-green-500'>Resolved</span>
      )}
    </Thread>
  )
}

// Comments
const Comments = () => {
  // useThreads 
  const { threads } = useThreads()

  return (
    <div className='comments-container'>
      {/* Composer */}
      <Composer className='comment-composer' />


      {threads.length === 0 && (
        <div className='text-gray-500'>
          No comments yet. Start a conversation!
        </div>
      )}

      {threads.map((thread) => (
        <ThreadWrapper key={thread.id} thread={thread} />
      ))}
    </div>
  )
}

// Comments export
export default Comments
