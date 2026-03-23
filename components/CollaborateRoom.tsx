'use client'
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs'
import ActiveCollaborators from './ActiveCollaborators'
import Loader from './Loader'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { updateDocument } from '@/lib/actions/room.actions'
import ShareModal from './ShareModal'

const CollaborateRoom = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
}: CollaborativeRoomProps) => {
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

 
  const handleTitleUpdate = useCallback(async () => {
    if (documentTitle !== roomMetadata.title) {
      setLoading(true)
      try {
        await updateDocument({ roomId, title: documentTitle })
      } catch (error) {
        console.error(`Error updating document title: ${error}`)
      } finally {
        setLoading(false)
        setEditing(false)
      }
    } else {
      setEditing(false)
    }
  }, [documentTitle, roomId, roomMetadata.title])


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleUpdate()
    }
  }


  useEffect(() => {
    if (!editing) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleTitleUpdate()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [editing, handleTitleUpdate])


  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editing])

  return (

    <RoomProvider id={roomId}>

      <ClientSideSuspense fallback={<Loader />}>
        <div className='collaborative-room'>
          <Header>
            <div
              ref={containerRef}
              className='flex w-fit items-center justify-center gap-2'
            >
              {editing && !loading ? (
                <Input
                  ref={inputRef}
                  value={documentTitle}
                  type='text'
                  placeholder='Enter title'
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  className='document-title-input'
                />
              ) : (
                <h1 className='document-title'>{documentTitle}</h1>
              )}

              {currentUserType === 'editor' && !editing && (
                <Image
                  src='/assets/icons/edit.svg'
                  alt='edit'
                  width={24}
                  height={24}
                  onClick={() => setEditing(true)}
                  className='cursor-pointer'
                />
              )}

              {currentUserType !== 'editor' && !editing && (
                <p className='view-only-tag'>View only</p>
              )}

              {loading && <p className='text-sm text-gray-400'>Saving...</p>}
            </div>

            <div className='flex flex-1 justify-end gap-2 sm:gap-3'>
              <ActiveCollaborators />
              <ShareModal
                roomId={roomId}
                collaborators={users}
                creatorId={roomMetadata.creatorId}
                currentUserType={currentUserType}
              />
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </Header>
          <Editor roomId={roomId} currentUserType={currentUserType} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  )
}

export default CollaborateRoom
