"use client"

import { ChatbotUIContext } from "@/context/context"
import { IconNotebook, IconPlus, IconTrash } from "@tabler/icons-react"
import { FC, useContext, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

interface Note {
  id: string
  title: string
  content: string
  updatedAt: number
}

const getStorageKey = (workspaceId: string | undefined) =>
  `chatbotui-notes-${workspaceId ?? "global"}`

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`
}

interface NotesPanelProps {}

export const NotesPanel: FC<NotesPanelProps> = ({}) => {
  const { selectedWorkspace } = useContext(ChatbotUIContext)

  const [notes, setNotes] = useState<Note[]>([])
  const [hydrated, setHydrated] = useState(false)

  const storageKey = getStorageKey(selectedWorkspace?.id)

  // Load notes for the active workspace from localStorage.
  useEffect(() => {
    setHydrated(false)

    try {
      const raw = localStorage.getItem(storageKey)
      setNotes(raw ? (JSON.parse(raw) as Note[]) : [])
    } catch {
      setNotes([])
    }

    setHydrated(true)
  }, [storageKey])

  // Persist notes whenever they change (after the initial load).
  useEffect(() => {
    if (!hydrated) return

    try {
      localStorage.setItem(storageKey, JSON.stringify(notes))
    } catch {
      // Ignore quota / serialization errors — notes are best-effort local storage.
    }
  }, [notes, hydrated, storageKey])

  const handleCreateNote = () => {
    const newNote: Note = {
      id: createId(),
      title: "",
      content: "",
      updatedAt: Date.now()
    }

    setNotes(prev => [newNote, ...prev])
  }

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
      )
    )
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  return (
    <div className="flex max-h-[calc(100%-50px)] grow flex-col">
      <div className="mt-2 flex items-center">
        <Button
          className="flex h-[36px] grow items-center space-x-2"
          size="sm"
          onClick={handleCreateNote}
        >
          <IconPlus size={20} />
          <div className="ml-1">New Note</div>
        </Button>
      </div>

      <div className="mt-4 flex flex-col space-y-3 overflow-auto">
        {notes.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center pt-10 text-center">
            <IconNotebook size={40} strokeWidth={1.5} />
            <div className="mt-3 text-sm">
              No notes yet. Create one to jot down anything you like.
            </div>
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className="border-input flex flex-col rounded-md border p-2"
            >
              <div className="flex items-center">
                <Input
                  className="h-8 border-none px-1 font-semibold focus-visible:ring-0"
                  placeholder="Title"
                  value={note.title}
                  onChange={e =>
                    handleUpdateNote(note.id, { title: e.target.value })
                  }
                />

                <Button
                  className="text-muted-foreground hover:text-foreground size-8 shrink-0"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <IconTrash size={18} />
                </Button>
              </div>

              <Textarea
                className="mt-1 min-h-[80px] resize-none border-none px-1 focus-visible:ring-0"
                placeholder="Write a note..."
                value={note.content}
                onChange={e =>
                  handleUpdateNote(note.id, { content: e.target.value })
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
