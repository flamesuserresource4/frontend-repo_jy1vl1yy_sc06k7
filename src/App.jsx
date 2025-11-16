import { useEffect, useState } from 'react'
import ConversationsPane from './components/ConversationsPane'
import ChatWindow from './components/ChatWindow'

function App() {
  const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [activeId, setActiveId] = useState(null)

  // Auto-create a first conversation on mount for quick start
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/conversations`)
        const data = await res.json()
        if (data.length > 0) {
          setActiveId(data[0].id)
        } else {
          const res2 = await fetch(`${apiBase}/api/conversations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'New Chat' })
          })
          const d2 = await res2.json()
          setActiveId(d2.id)
        }
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50">
      <div className="h-screen max-h-screen grid grid-cols-1 md:grid-cols-3">
        <div className="md:border-r bg-white/70 backdrop-blur col-span-1">
          <ConversationsPane apiBase={apiBase} activeId={activeId} onSelect={setActiveId} />
        </div>
        <div className="col-span-2">
          <ChatWindow apiBase={apiBase} conversationId={activeId} />
        </div>
      </div>
    </div>
  )
}

export default App
