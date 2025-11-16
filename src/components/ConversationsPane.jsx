import { useEffect, useState } from 'react'
import { Plus, MessageSquare } from 'lucide-react'

export default function ConversationsPane({ apiBase, activeId, onSelect }) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiBase}/api/conversations`)
      const data = await res.json()
      setConversations(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const createConversation = async () => {
    try {
      setCreating(true)
      const title = `Chat ${conversations.length + 1}`
      const res = await fetch(`${apiBase}/api/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })
      const data = await res.json()
      setConversations([data, ...conversations])
      onSelect && onSelect(data.id)
    } catch (e) {
      console.error(e)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="font-semibold">Chats</div>
        <button
          onClick={createConversation}
          disabled={creating}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm active:scale-[.98] disabled:opacity-60"
        >
          <Plus size={16} /> New
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Loading…</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No conversations yet. Create one to start chatting.</div>
        ) : (
          <ul className="divide-y">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => onSelect && onSelect(c.id)}
                  className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 ${activeId === c.id ? 'bg-gray-50' : ''}`}
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                    <MessageSquare size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{c.title}</div>
                    <div className="text-xs text-gray-500">{c.created_by || 'You'}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
